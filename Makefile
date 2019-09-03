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
	az webapp log config --application-logging true \
		--web-server-logging filesystem \
		--docker-container-logging filesystem \
		--level information \
		--name $(APPNAME) \
		--resource-group $(RG)

open: logging
	open https://$(APPNAME).azurewebsites.net

logs:
	az webapp log tail -n $(APPNAME) -g $(RG)

rollback:
	az group delete -n $(RG) -y

.PHONY: build logs rollback open webapp rg plan all
