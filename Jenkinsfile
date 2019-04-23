#!/usr/bin/env groovy

pipeline {
    agent {
        docker
    }

    stages {
        stage('Build') {
            steps {
                echo '\nBuilding...'
                setBuildStatus('Building...', 'PENDING')

                // Install dependencies.
                sh 'npm install'

                // Disable git hooks in Jenkins, as they interfere with semantic-release.
                sh 'rm -rf .git/hooks'
            }
        }

        stage('Test') {
            steps {
                echo '\nTesting...'
                setBuildStatus('Testing...', 'PENDING')

                // Run the test suite.
                sh 'npm test'
            }
        }

        stage('Release') {
            when {
                branch 'master'
            }
            steps {
                echo '\nBuilding...'
                setBuildStatus('Publishing...', 'PENDING')

                // Run semantic-release with the necessary credentials.
                script {
                    credentials = [
                            string(credentialsId: 'github-personal-access-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')
                    ]
                }
                withCredentials(credentials) {
                    sh 'npx semantic-release'
                }

                // Update the build information with the appropriate metadata.
                echo '\nFinishing up...'
                script {
                    RELEASE_VERSION = sh ( script: "git tag --points-at", returnStdout: true ).trim()
                    if (RELEASE_VERSION) {
                        RELEASE_URL = "https://github.com/Tanndev/performance-profiler/releases/tag/${RELEASE_VERSION}"
                        echo "Version: ${RELEASE_VERSION} can be viewed at ${RELEASE_URL}"
                        currentBuild.displayName = RELEASE_VERSION
                        currentBuild.description = RELEASE_URL
                    }
                }
            }
        }
    }

    post {
        success {
            setBuildStatus("Passed", "SUCCESS")
        }
        failure {
            setBuildStatus( "Failed", "FAILED")
        }
    }
}

void setBuildStatus(String message, String status) {
    githubNotify context: 'Jenkins CI', description: message,  status: status
}
