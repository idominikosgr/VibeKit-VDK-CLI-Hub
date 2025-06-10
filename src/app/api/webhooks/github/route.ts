// GitHub webhook handler for rule updates
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createGitHubSync } from '@/lib/services/github/github-sync';

// GitHub webhook secret from environment variables
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';

/**
 * Verify the webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('GITHUB_WEBHOOK_SECRET is not set');
    return false;
  }

  const hmac = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  const trusted = `sha256=${hmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(trusted),
    Buffer.from(signature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Get the raw payload
    const payload = await request.text();

    // Verify signature
    if (!verifySignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the payload
    const data = JSON.parse(payload);

    // Check if it's a push event
    if (request.headers.get('x-github-event') !== 'push') {
      return NextResponse.json({
        status: 'skipped',
        message: 'Not a push event'
      });
    }

    // Check if the push is to the main branch
    if (data.ref !== 'refs/heads/main' && data.ref !== 'refs/heads/master') {
      return NextResponse.json({
        status: 'skipped',
        message: `Push was to ${data.ref}, not main/master branch`
      });
    }

    // Check if any .mdc files were modified
    const modifiedMdcFiles = data.commits.flatMap((commit: any) => [
      ...commit.added || [],
      ...commit.modified || []
    ]).filter((file: string) => file.endsWith('.mdc'));

    if (modifiedMdcFiles.length === 0) {
      return NextResponse.json({
        status: 'skipped',
        message: 'No .mdc files were modified'
      });
    }

    // Determine if we need a full sync or just sync specific files
    let syncResult;
    const syncService = createGitHubSync({
      logResults: true
    });

    if (modifiedMdcFiles.length > 10) {
      // If many files were changed, do a full sync
      syncResult = await syncService.syncAllRules();
    } else {
      // Otherwise, just sync the specific files
      // Note: This would require modifying our sync service to support syncing specific files
      // For now, we'll do a full sync
      syncResult = await syncService.syncAllRules();
    }

    return NextResponse.json({
      status: 'success',
      message: `Sync completed due to GitHub webhook`,
      result: {
        added: syncResult.added,
        updated: syncResult.updated,
        errors: syncResult.errors.length,
        duration: `${syncResult.duration}ms`,
      }
    });
  } catch (error) {
    console.error('Error processing GitHub webhook:', error);

    return NextResponse.json(
      { error: 'Failed to process webhook', message: (error as Error).message },
      { status: 500 }
    );
  }
}
