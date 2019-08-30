IMAGENAME=clearfunction/clearbot

lint:
	yarn run lint

build:
  docker build -t $(IMAGENAME)

run:
  docker run --env-file=.env -t -i $(IMAGENAME)
