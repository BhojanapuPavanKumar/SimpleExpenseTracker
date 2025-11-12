pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "pavankumar0185"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/expentix-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/expentix-backend"
        EC2_HOST       = "ubuntu@13.126.93.145"
    }

    triggers {
        githubPush()  // Auto-trigger when code pushed to GitHub
    }

    options {
        retry(1) // Retry the entire pipeline once if something fails
        skipStagesAfterUnstable() // Skip unnecessary stages after major failure
    }

    stages {
        stage('1️⃣ Checkout Code') {
            steps {
                echo "🔄 Checking out latest code..."
                git branch: 'main', url: 'https://github.com/BhojanapuPavanKumar/SimpleExpenseTracker.git'
            }
        }

        stage('2️⃣ Build Frontend Image') {
            steps {
                dir('Frontend-Expense-Tracker') {
                    echo "🏗️ Building Frontend Docker image..."
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh 'docker build -t ${FRONTEND_IMAGE}:latest .'
                    }
                }
            }
        }

        stage('3️⃣ Build Backend Image') {
            steps {
                dir('Backend-Expense-Tracker') {
                    echo "🏗️ Building Backend Docker image..."
                    sh 'docker build -t ${BACKEND_IMAGE}:latest .'
                }
            }
        }

        stage('4️⃣ Login to DockerHub') {
            steps {
                echo "🔐 Logging into DockerHub..."
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

        stage('6️⃣ Deploy on EC2') {
            steps {
                echo "🚀 Deploying new containers on EC2..."
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no $EC2_HOST "
                            echo '🧹 Cleaning old containers and freeing ports...';
                            sudo fuser -k 2900/tcp || true;
                            sudo fuser -k 80/tcp || true;
                            docker stop expentix_frontend expentix_backend || true &&
                            docker rm -f expentix_frontend expentix_backend || true &&
                            docker system prune -f;

                            echo '⬇️ Pulling latest images from DockerHub...';
                            docker pull ${FRONTEND_IMAGE}:latest &&
                            docker pull ${BACKEND_IMAGE}:latest;

                            echo '🚀 Starting backend container...';
                            docker run -d --name expentix_backend -p 2900:2900 ${BACKEND_IMAGE}:latest;

                            echo '🚀 Starting frontend container...';
                            docker run -d --name expentix_frontend -p 80:80 -e VITE_BACKEND_URL=http://13.126.93.145:2900/api/v1 ${FRONTEND_IMAGE}:latest;

                            echo '✅ Deployment finished successfully!';
                        "
                    '''
                }
            }
        }

        stage('7️⃣ Cleanup Docker Cache') {
            steps {
                echo "🧹 Cleaning local Docker cache..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline executed successfully — Frontend & Backend live on EC2! 🚀"
        }
        failure {
            echo "❌ Build or deployment failed — check Jenkins logs carefully."
        }
    }
}
