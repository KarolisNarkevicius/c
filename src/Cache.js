const fs = require('fs');
const _ = require('lodash');

class Cache {
	
	constructor() {

		//set cache file path
		this.cacheFilePath = __basePath + '/' + 'storage/cache.json'

		//check if cache exists in storage
		if (!fs.existsSync(this.cacheFilePath)) {
			fs.writeFileSync(this.cacheFilePath, '{}');
		}

		//load values to cache array form cache file
		this.cache = {};
		this.reloadCacheArray();
	}
	
	set(key, value, ref=false) {
		if (!ref) {
			ref = this.cache;
		}

		let split = key.split('.');

		if (split.length > 1) {

			let k = split.shift();
			let newRef;
			if (!ref[k]) {
				ref[k] = {};
			}
			this.set(split.join('.'), value, ref[k]);
			return;

		} else {

			ref[key] = value;

		}

		this.writeCacheArrayToFile();
	}

	get(key=false, ref=false) {
		if (!key) {
			return this.cache;
		}
		if (!ref) {
			ref = this.cache;
		}

		let split = key.split('.');
		if (split.length > 1) {

			let k = split.shift();
			key = split.join('.');
			if (ref[k]) {
				return this.get(key, ref[k]);
			}
			return null;

		} else {

			if (ref[key]) {
				return ref[key];
			}
			return null;
		
		}

	}

	remove(key, ref=false) {
		if (!ref) {
			ref = this.cache;
		}
		let split = key.split('.');
		if (split.length > 1) {

			let k = split.shift();
			key = split.join('.');
			if (ref[k]) {
				this.remove(key, ref[k]);
			}
			return null;

		} else {
			if (ref[key]) {
				if (Array.isArray(ref)) {
					ref.splice(key, 1);
				} else {
					delete ref[key];
				}
				this.writeCacheArrayToFile();
				this.reloadCacheArray();
			}
		}
	}

	push(key, value, ref=false) {
		if (!ref) {
			ref = this.cache;
		}

		let split = key.split('.');

		if (split.length > 1) {

			let k = split.shift();
			let newRef;
			if (!ref[k]) {
				ref[k] = {};
			}
			this.set(split.join('.'), value, ref[k]);
			return;

		} else {
			if (!ref[key]) {
				ref[key] = [];
			}
			ref[key].push(value);

		}

		this.writeCacheArrayToFile();
	}

	reloadCacheArray() {
		let file = fs.readFileSync(this.cacheFilePath).toString();
		try {
			this.cache = JSON.parse(file);
		} catch(e) {
			this.cache = {};
		}
	}

	writeCacheArrayToFile() {
		fs.unlinkSync(this.cacheFilePath);
		fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache));
	}

}

module.exports = new Cache();