#!/usr/bin/env groovy

pipeline {
    agent {
        docker { image 'node:10-alpine' }
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
    }
}
