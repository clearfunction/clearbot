TAG_SHA := $(shell git rev-parse HEAD | cut -c1-6 )

push:
	docker build . -t clearbot/hubot
	docker tag clearbot/hubot clearfunction.azurecr.io/clearbot/hubot:${TAG_SHA}
	docker push clearfunction.azurecr.io/clearbot/hubot:${TAG_SHA}

deploy:
	kubectl apply -f ./hubot-k8s.yaml

docker_login:
	az acr login --name clearfunction
