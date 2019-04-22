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
    }
}
