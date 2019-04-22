#!/usr/bin/env groovy

pipeline {
    agent {
        docker { image 'jftanner/jenkins-agent'}
    }

    environment {
        HOME="."
    }

    stages {
        stage('Build') {
            steps {
                echo '\nBuilding...'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo '\nTesting...'
                sh 'npm test'
            }
        }

        stage('Release') {
            when {
                branch 'master'
            }
            steps {
                // Run Semantic release
                script {
                    credentials = [
                            string(credentialsId: 'github-personal-access-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')
                    ]
                }
                withCredentials(credentials) {
                    sh 'npx semantic-release'
                }
                script {
                    RELEASE_VERSION = sh ( script: "git tag --points-at", returnStdout: true ).trim()
                    RELEASE_URL = 'https://github.com/Tanndev/performance-profiler/releases/tag/' + RELEASE_VERSION
                    echo "Version: ${RELEASE_VERSION} can be viewed at ${RELEASE_URL}"
                    currentBuild.displayName = RELEASE_VERSION
                    currentBuild.description = RELEASE_URL
                }
            }
        }
    }
}
