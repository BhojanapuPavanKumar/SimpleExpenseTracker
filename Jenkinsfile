pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "pavankumar0185"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/expentix-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/expentix-backend"
        EC2_HOST       = "ubuntu@13.126.93.145"
    }

    triggers {
        githubPush()  // Auto-trigger on every GitHub commit
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
                dir('Frontend-Expense-Tracker') {
                    echo "🏗️ Building frontend Docker image..."
                    sh '''
                        echo "📦 Starting frontend build..."
                        docker build -t ${FRONTEND_IMAGE}:latest .
                    '''
                }
            }
        }

        stage('3️⃣ Build Backend Image') {
            steps {
                dir('Backend-Expense-Tracker') {
                    echo "🏗️ Building backend Docker image..."
                    sh '''
                        echo "📦 Starting backend build..."
                        docker build -t ${BACKEND_IMAGE}:latest .
                    '''
                }
            }
        }

        stage('4️⃣ Login to DockerHub') {
            steps {
                echo "🔐 Logging into DockerHub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                    '''
                }
            }
        }

        stage('5️⃣ Push Images to DockerHub') {
            steps {
                echo "📤 Pushing images to DockerHub..."
                sh '''
                    docker push ${FRONTEND_IMAGE}:latest
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('6️⃣ Deploy on EC2') {
            steps {
                echo "🚀 Deploying latest containers on EC2..."
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no $EC2_HOST "
                            echo '🛑 Stopping old containers...'
                            docker stop expentix_frontend || true
                            docker stop expentix_backend || true

                            echo '🧹 Removing old containers...'
                            docker rm expentix_frontend || true
                            docker rm expentix_backend || true

                            echo '📥 Pulling latest images...'
                            docker pull ${FRONTEND_IMAGE}:latest
                            docker pull ${BACKEND_IMAGE}:latest

                            echo '🚀 Starting new containers...'
                            docker run -d --name expentix_backend -p 2900:2900 ${BACKEND_IMAGE}:latest
                            docker run -d --name expentix_frontend -p 80:80 -e VITE_BACKEND_URL=http://13.126.93.145:2900/api/v1 ${FRONTEND_IMAGE}:latest

                            echo '✅ Deployment complete!'
                        "
                    '''
                }
            }
        }

        stage('7️⃣ Cleanup Docker') {
            steps {
                echo "🧹 Cleaning up local Docker cache..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ Build + Push + EC2 Deployment completed successfully!"
        }
        failure {
            echo "❌ Build failed — check console logs for details."
        }
    }
}
