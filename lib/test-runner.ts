"use server"

import { testEmailSystem, getEmailConfigStatus } from "@/app/email-test/actions"
import { testAWSSESConnection, validateSESConfiguration } from "@/lib/aws-ses"

export async function runBackendTests() {
  console.log("🧪 Starting backend test suite...")
  const results = []

  try {
    // Test 1: Email Configuration Status
    console.log("📧 Testing email configuration...")
    const configStatus = await getEmailConfigStatus()
    results.push({
      test: "Email Configuration",
      passed: configStatus.configured,
      message: configStatus.configured
        ? "All email environment variables are configured"
        : "Missing email configuration variables",
      details: configStatus.details,
    })

    // Test 2: SES Configuration Validation
    console.log("🔧 Validating SES configuration...")
    const sesValidation = await validateSESConfiguration()
    results.push({
      test: "SES Configuration Validation",
      passed: sesValidation.isValid,
      message: sesValidation.isValid
        ? "SES configuration is valid"
        : `SES configuration issues: ${sesValidation.issues.join(", ")}`,
      details: sesValidation.configuration,
    })

    // Test 3: AWS SES Connection Test
    console.log("🌐 Testing AWS SES connection...")
    const connectionTest = await testAWSSESConnection()
    results.push({
      test: "AWS SES Connection",
      passed: connectionTest.success,
      message: connectionTest.message,
      details: connectionTest.details,
    })

    // Test 4: Email System Integration Test
    console.log("📨 Testing email system integration...")
    const systemTest = await testEmailSystem()
    results.push({
      test: "Email System Integration",
      passed: systemTest.success,
      message: systemTest.message,
      details: systemTest.details,
    })

    // Test 5: Environment Variables Check
    console.log("🔐 Checking critical environment variables...")
    const criticalEnvVars = [
      "AWS_SES_REGION",
      "AWS_SES_ACCESS_KEY_ID",
      "AWS_SES_SECRET_ACCESS_KEY",
      "AWS_SES_FROM_EMAIL",
      "RECAPTCHA_SITE_KEY",
      "RECAPTCHA_SECRET_KEY",
    ]

    const envResults = criticalEnvVars.map((varName) => ({
      variable: varName,
      present: !!process.env[varName],
      value: process.env[varName]
        ? varName.includes("SECRET") || varName.includes("KEY")
          ? "[HIDDEN]"
          : process.env[varName]
        : "NOT SET",
    }))

    const allEnvPresent = envResults.every((env) => env.present)
    results.push({
      test: "Environment Variables",
      passed: allEnvPresent,
      message: allEnvPresent
        ? "All critical environment variables are set"
        : "Some critical environment variables are missing",
      details: envResults,
    })

    // Summary
    const passedTests = results.filter((r) => r.passed).length
    const totalTests = results.length
    const allPassed = passedTests === totalTests

    console.log(`✅ Test Results: ${passedTests}/${totalTests} tests passed`)

    return {
      success: allPassed,
      summary: `${passedTests}/${totalTests} tests passed`,
      results,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("❌ Test suite failed:", error)
    return {
      success: false,
      summary: "Test suite execution failed",
      error: error instanceof Error ? error.message : "Unknown error",
      results,
      timestamp: new Date().toISOString(),
    }
  }
}

export async function runSingleTest(testName: string) {
  console.log(`🧪 Running single test: ${testName}`)

  try {
    switch (testName.toLowerCase()) {
      case "email":
      case "email-system":
        return await testEmailSystem()

      case "ses":
      case "aws-ses":
        return await testAWSSESConnection()

      case "config":
      case "configuration":
        return await getEmailConfigStatus()

      case "validation":
      case "ses-validation":
        return await validateSESConfiguration()

      default:
        return {
          success: false,
          message: `Unknown test: ${testName}. Available tests: email, ses, config, validation`,
        }
    }
  } catch (error) {
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
