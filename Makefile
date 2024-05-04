start:
	clear
	echo "\n\n\n\nStaring..."
	npm run --prefix backend build
	npm run --prefix backend single

dev: 
	clear
	echo "\n\n\n\nStaring dev..."
	npm run --prefix backend build
	npm run --prefix backend dev

clean:
	clear
	echo "\n\n\n\nClearing..."
	rm -rf ./backend/fs/*
	rm -rf ./backend/dist/*

install:
	clear
	echo "\n\n\n\nInstalling..."
	npm install --prefix backend