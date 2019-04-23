#!/usr/bin/env groovy

pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.Jenkins-agent'
//            args '-u 0:0'
        }
    }

    stages {
        stage('Build') {
            steps {
                echo '\nBuilding...'
                setBuildStatus('Building...', 'PENDING')
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo '\nTesting...'
                setBuildStatus('Testing...', 'PENDING')
                sh 'npm test -- --quickly'
            }
        }

        stage('Release') {
            when {
                branch 'master'
            }
            steps {
                echo '\nBuilding...'
                setBuildStatus('Publishing...', 'PENDING')
                script {
                    credentials = [
                            string(credentialsId: 'github-personal-access-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')
                    ]
                }
                withCredentials(credentials) {
                    sh 'npx semantic-release'
                }

                echo '\nFinishing up...'
                script {
                    RELEASE_VERSION = sh ( script: "git tag --points-at", returnStdout: true ).trim()
                    RELEASE_URL = "https://github.com/Tanndev/performance-profiler/releases/tag/${RELEASE_VERSION}"
                    echo "Version: ${RELEASE_VERSION} can be viewed at ${RELEASE_URL}"
                    currentBuild.displayName = RELEASE_VERSION
                    currentBuild.description = RELEASE_URL
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
