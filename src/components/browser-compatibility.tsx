"use client"

import { useEffect, useState } from "react"
import { WarningIcon } from "@phosphor-icons/react"

import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface BrowserFeature {
  name: string
  testFn: () => boolean
  criticalForApp: boolean
}

const REQUIRED_FEATURES: BrowserFeature[] = [
  {
    name: "CSS Grid",
    testFn: () => typeof document !== 'undefined' && 'grid' in document.documentElement.style,
    criticalForApp: true
  },
  {
    name: "CSS Variables",
    testFn: () => typeof document !== 'undefined' && window.CSS && CSS.supports('--color: red'),
    criticalForApp: true
  },
  {
    name: "Fetch API",
    testFn: () => typeof fetch !== 'undefined',
    criticalForApp: true
  },
  {
    name: "Intersection Observer",
    testFn: () => typeof IntersectionObserver !== 'undefined',
    criticalForApp: false
  },
  {
    name: "ES6 Modules",
    testFn: () => {
      // If we're in a Next.js bundled environment and can execute this code, ES6 modules are working
      if (typeof window === 'undefined') return true; // SSR
      // Simple check: if the browser supports modern features, it supports ES6 modules
      return typeof Promise !== 'undefined' && typeof Symbol !== 'undefined';
    },
    criticalForApp: false // Make this non-critical since it's causing false positives
  },
  {
    name: "CSS Flex",
    testFn: () => typeof document !== 'undefined' && 'flex' in document.documentElement.style,
    criticalForApp: true
  },
  {
    name: "Local Storage",
    testFn: () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined',
    criticalForApp: true
  }
]

export function BrowserCompatibilityCheck() {
  const [incompatibleFeatures, setIncompatibleFeatures] = useState<string[]>([])
  const [criticalFeaturesIncompatible, setCriticalFeaturesIncompatible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const missingFeatures: string[] = []
    let hasMissingCriticalFeatures = false

    REQUIRED_FEATURES.forEach(feature => {
      try {
        const isSupported = feature.testFn()
        if (!isSupported) {
          missingFeatures.push(feature.name)
          if (feature.criticalForApp) {
            hasMissingCriticalFeatures = true
          }
        }
      } catch (error) {
        // If testing for the feature itself causes an error, it's not supported
        missingFeatures.push(feature.name)
        if (feature.criticalForApp) {
          hasMissingCriticalFeatures = true
        }
      }
    })

    setIncompatibleFeatures(missingFeatures)
    setCriticalFeaturesIncompatible(hasMissingCriticalFeatures)
    setChecked(true)
  }, [])

  if (!checked || incompatibleFeatures.length === 0) {
    return null
  }

  return (
    <Alert variant={criticalFeaturesIncompatible ? "destructive" : "default"} className="my-6">
      <WarningIcon className="h-4 w-4" />
      <AlertTitle>Browser Compatibility Issue</AlertTitle>
      <AlertDescription>
        {criticalFeaturesIncompatible ? (
          <>
            <p>
              Your browser doesn&apos;t support some critical features needed for this application to work properly. 
              Please consider updating your browser or switching to a modern browser like Chrome, Edge, Firefox, or Safari.
            </p>
            <p className="font-semibold mt-2">Missing features:</p>
            <ul className="list-disc pl-5 mt-1">
              {incompatibleFeatures.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>
              Your browser is missing some features that may affect your experience, but the application should still work.
              For the best experience, consider updating your browser.
            </p>
            <p className="font-semibold mt-2">Missing non-critical features:</p>
            <ul className="list-disc pl-5 mt-1">
              {incompatibleFeatures.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
