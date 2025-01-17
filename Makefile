.PHONY: build clean logs restart frontend-format
# Docker-related commands
build:
	docker-compose down
	docker-compose up --build

clean:
	docker-compose down --volumes --remove-orphans

logs:
	docker-compose logs -f

# Frontend-related commands
frontend-format:
	docker exec -it frontend-container npm run format

# To clean frontend: npm run clean

# To clean backend: mvn clean package
# To format backend: mvn spotless:apply, mvn spotless:check