declare module 'octokit' {
  export class Octokit {
    constructor(options?: { auth?: string })
    rest: {
      git: {
        getTree: (params: { owner: string, repo: string, tree_sha: string, recursive: string }) => Promise<{ data: { tree: any[] } }>
      },
      repos: {
        getContent: (params: { owner: string, repo: string, path: string, mediaType?: { format: string } }) => Promise<{ data: any }>
      }
    }
  }
}
