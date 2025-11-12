pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "pavankumar0185"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/expentix-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/expentix-backend"
    }

    triggers {
        githubPush()   // Automatically trigger on GitHub push
    }

    stages {
        stage('1️⃣ Checkout Code') {
            steps {
                echo "🔄 Checking out latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/BhojanapuPavanKumar/SimpleExpenseTracker.git'
            }
        }

        stage('2️⃣ Build Frontend Image') {
            steps {
                dir('frontend') {
                    echo "🏗️ Building frontend Docker image..."
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest .'
                }
            }
        }

        stage('3️⃣ Build Backend Image') {
            steps {
                dir('backend') {
                    echo "🏗️ Building backend Docker image..."
                    sh 'docker build -t ${BACKEND_IMAGE}:latest .'
                }
            }
        }

        stage('4️⃣ Login to DockerHub') {
            steps {
                echo "🔐 Logging in to DockerHub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('5️⃣ Push Images to DockerHub') {
            steps {
                echo "📤 Pushing Docker images to DockerHub..."
                sh '''
                    docker push ${FRONTEND_IMAGE}:latest
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('6️⃣ Cleanup Docker') {
            steps {
                echo "🧹 Cleaning up local Docker cache..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ Build and push completed successfully! Images live on DockerHub 🚀"
        }
        failure {
            echo "❌ Build failed — check Jenkins logs for details."
        }
    }
}
