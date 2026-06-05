TAG_SHA := $(shell git rev-parse HEAD | cut -c1-6 )

RG=clearbot-rg
APPNAME=clearbot-dev
PLAN=clearbot-plan
LOCATION="Central US"
SKU=F1
IMAGENAME=clearfunction/clearbot

lint:
	yarn run lint

build:
	docker build -t $(IMAGENAME) .

run:
	docker run --env-file=.env --rm -t -i $(IMAGENAME)

push: build
	docker tag $(IMAGENAME) $(IMAGENAME):$(TAG_SHA)
	docker push $(IMAGENAME):$(TAG_SHA)

rg:
	az group create -n $(RG) -l $(LOCATION)

plan: rg
	az appservice plan create -g $(RG) \
		-n $(PLAN) \
		--sku $(SKU) \
		--is-linux

webapp: plan
	az webapp create -n $(APPNAME) \
		-g $(RG) \
		-p $(PLAN) \
		-i $(IMAGENAME):$(TAG_SHA)

logging: webapp
	az webapp log config --application-logging filesystem \
		--web-server-logging filesystem \
		--docker-container-logging filesystem \
		--level information \
		--name $(APPNAME) \
		--resource-group $(RG)

open: logging
	open https://$(APPNAME).azurewebsites.net

# Run `websockets` and `appsettings` after `webapp` (post-deploy).
# Socket Mode means SLACK_SIGNING_SECRET is no longer used; the bot needs
# SLACK_APP_TOKEN and RELAY_TOKEN instead. WebSockets must be enabled on the
# App Service (off by default) for the native Bun.serve relay connections.
websockets:
	az webapp config set -n $(APPNAME) -g $(RG) --web-sockets-enabled true

appsettings:
	az webapp config appsettings set -n $(APPNAME) -g $(RG) --settings \
		SLACK_BOT_TOKEN="$$SLACK_BOT_TOKEN" \
		SLACK_APP_TOKEN="$$SLACK_APP_TOKEN" \
		RELAY_TOKEN="$$RELAY_TOKEN"

logs:
	az webapp log tail -n $(APPNAME) -g $(RG)

rollback:
	az group delete -n $(RG) -y

.PHONY: build logs rollback open webapp rg plan all websockets appsettings
