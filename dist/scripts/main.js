/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b38daa2e6cfa62392cd2"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/app/themes/sage/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(17)(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/html-entities/lib/html5-entities.js ***!
  \********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 1 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 3);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
/*!********************************************************************************!*\
  !*** (webpack)-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 5);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 8);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 10)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 15);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 4)(module)))

/***/ }),
/* 4 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/*!*********************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/querystring-es3/index.js ***!
  \*********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 6);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 7);


/***/ }),
/* 6 */
/*!**********************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/querystring-es3/decode.js ***!
  \**********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 7 */
/*!**********************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/querystring-es3/encode.js ***!
  \**********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 8 */
/*!****************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/strip-ansi/index.js ***!
  \****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 9)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 9 */
/*!****************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/ansi-regex/index.js ***!
  \****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 10 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/client-overlay.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 11);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 11 */
/*!***************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/ansi-html/index.js ***!
  \***************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 12 */
/*!*******************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/html-entities/index.js ***!
  \*******************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 13),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 14),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
};


/***/ }),
/* 13 */
/*!******************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/html-entities/lib/xml-entities.js ***!
  \******************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 14 */
/*!********************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/html-entities/lib/html4-entities.js ***!
  \********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 15 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/process-update.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 16 */
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/cache-loader/dist/cjs.js!C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/css-loader?{"sourceMap":true}!C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/postcss-loader/lib?{"config":{"path":"C://xampp//apps//wordpress//htdocs//wp-content//themes//acma-theme//resources//assets//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]_[hash:8]","paths":{"root":"C://xampp//apps//wordpress//htdocs//wp-content//themes//acma-theme","assets":"C://xampp//apps//wordpress//htdocs//wp-content//themes//acma-theme//resources//assets","dist":"C://xampp//apps//wordpress//htdocs//wp-content//themes//acma-theme//dist"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["app/**_/*.php","config/**_/*.php","resources/views/**_/*.php"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"customizer":["./scripts/customizer.js"]},"publicPath":"/app/themes/sage/dist/","devUrl":"http://localhost:81/wordpress/","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/resolve-url-loader?{"sourceMap":true}!C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/import-glob!./styles/main.scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ 29)(true);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\n/** Import theme styles */\n\n/* line 1, resources/assets/styles/common/_global.scss */\n\nbody {\n  margin: 0;\n}\n\n/* line 5, resources/assets/styles/common/_global.scss */\n\n* {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* line 9, resources/assets/styles/common/_global.scss */\n\na {\n  text-decoration: none;\n  color: #09c;\n}\n\n/* line 14, resources/assets/styles/common/_global.scss */\n\nhtml {\n  font-family: 'Lato', sans-serif;\n  color: #222;\n}\n\n/* line 19, resources/assets/styles/common/_global.scss */\n\n.flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n@media (max-width: 800px) {\n  /* line 21, resources/assets/styles/common/_global.scss */\n\n  .flex.mobile {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n  }\n}\n\n/* line 28, resources/assets/styles/common/_global.scss */\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: row;\n          flex-flow: row;\n}\n\n/* line 33, resources/assets/styles/common/_global.scss */\n\n.column {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n/* line 38, resources/assets/styles/common/_global.scss */\n\n.end {\n  -ms-flex-item-align: end;\n      align-self: flex-end;\n  margin-left: auto;\n}\n\n/* line 43, resources/assets/styles/common/_global.scss */\n\n.flex-align {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 48, resources/assets/styles/common/_global.scss */\n\n.center {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 54, resources/assets/styles/common/_global.scss */\n\n.text-center {\n  text-align: center;\n}\n\n/* line 58, resources/assets/styles/common/_global.scss */\n\n.inner-content {\n  width: 100%;\n  max-width: 1400px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin: auto;\n}\n\n/* line 65, resources/assets/styles/common/_global.scss */\n\n.flex-left {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n}\n\n/* line 71, resources/assets/styles/common/_global.scss */\n\n.wp-block-file {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 73, resources/assets/styles/common/_global.scss */\n\n.wp-block-file a {\n  font-weight: bold;\n}\n\n/* line 78, resources/assets/styles/common/_global.scss */\n\nhr {\n  border: 0;\n  border-bottom: 1px solid #ccc;\n}\n\n/* line 1, resources/assets/styles/components/_buttons.scss */\n\n.button {\n  background: #990000;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  margin: 5px;\n}\n\n/* line 12, resources/assets/styles/components/_buttons.scss */\n\n.button.secondary {\n  background: #164472;\n}\n\n/* line 15, resources/assets/styles/components/_buttons.scss */\n\n.button.search {\n  padding: 5px;\n}\n\n/* line 19, resources/assets/styles/components/_buttons.scss */\n\n.button.featured {\n  margin: 15px 0;\n  padding: 10px 20px;\n  font-size: 1.4em;\n}\n\n/* line 24, resources/assets/styles/components/_buttons.scss */\n\n.button.bright {\n  background: #b81414;\n}\n\n/* line 27, resources/assets/styles/components/_buttons.scss */\n\n.button.box-shadow {\n  -webkit-box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5);\n          box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5);\n}\n\n/* line 30, resources/assets/styles/components/_buttons.scss */\n\n.button.flat {\n  background: none;\n  color: #c00;\n}\n\n/* line 33, resources/assets/styles/components/_buttons.scss */\n\n.button.flat.secondary {\n  color: #164472;\n}\n\n/* line 37, resources/assets/styles/components/_buttons.scss */\n\n.button.small-button-text {\n  font-size: 1.1em;\n}\n\n/* line 1, resources/assets/styles/components/_forms.scss */\n\ninput,\ntextarea {\n  padding: 10px;\n  border-radius: 4px;\n  border: 0;\n  border: 1px solid #ccc;\n  margin-top: 5px;\n  margin-bottom: 5px;\n  width: 100%;\n  max-width: 400px;\n  font-size: 1em;\n}\n\n/* line 13, resources/assets/styles/components/_forms.scss */\n\ninput[type=\"submit\"] {\n  background: #164472;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  text-align: center;\n  width: auto;\n}\n\n/* line 27, resources/assets/styles/components/_forms.scss */\n\nform {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 2, resources/assets/styles/layouts/_header.scss */\n\nheader .header-container {\n  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n}\n\n/* line 7, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon {\n  display: none;\n}\n\n/* line 9, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon i {\n  font-size: 1.5em;\n  vertical-align: sub;\n}\n\n/* line 13, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon a {\n  color: white;\n  padding: 11.5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n@media (max-width: 1000px) {\n  /* line 7, resources/assets/styles/layouts/_header.scss */\n\n  .menu-icon {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n/* line 26, resources/assets/styles/layouts/_header.scss */\n\n.main-header {\n  background: #A80D0D;\n}\n\n/* line 28, resources/assets/styles/layouts/_header.scss */\n\n.main-header .brand {\n  font-size: 2.3em;\n  font-weight: bold;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 4px 10px;\n}\n\n/* line 34, resources/assets/styles/layouts/_header.scss */\n\n.main-header .brand img {\n  max-height: 60px;\n}\n\n@media (max-width: 600px) {\n  /* line 28, resources/assets/styles/layouts/_header.scss */\n\n  .main-header .brand {\n    font-size: 1.5em;\n  }\n}\n\n/* line 41, resources/assets/styles/layouts/_header.scss */\n\n.main-header a {\n  color: white;\n}\n\n/* line 46, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav {\n  background: #7E0707;\n}\n\n@media (max-width: 1000px) {\n  /* line 48, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav #menu-primary {\n    z-index: 9;\n    position: absolute;\n    display: none;\n    top: 47px;\n    min-width: 250px;\n    right: 0px;\n    background: #5e0505;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n}\n\n/* line 60, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav ul {\n  list-style: none;\n  margin: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-left: 0;\n}\n\n/* line 65, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav ul a {\n  color: white;\n  text-decoration: none;\n  font-size: 1.2em;\n  padding: 12px 25px;\n  display: block;\n}\n\n@media (max-width: 1000px) {\n  /* line 73, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul a {\n    padding: 14px 45px;\n    border-bottom: 1px solid #410404;\n  }\n\n  /* line 78, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul.menu-item-has-children > a {\n    background: #711414;\n  }\n\n  /* line 82, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul.menu-item-has-children .sub-menu a {\n    padding-left: 10px;\n  }\n}\n\n/* line 89, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav .sub-menu {\n  display: none;\n  position: absolute;\n  background: #660606;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n@media (max-width: 1000px) {\n  /* line 89, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav .sub-menu {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    position: relative;\n  }\n}\n\n/* line 99, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav .menu-item-has-children > a:after {\n  color: #fff;\n  content: '\\25BE';\n}\n\n/* line 105, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav {\n  background: #0B253B;\n}\n\n/* line 107, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav .menu-secondary-nav-container {\n  width: 100%;\n}\n\n/* line 110, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul {\n  list-style: none;\n  margin: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-left: 0;\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 auto;\n          flex: 1 0 auto;\n}\n\n/* line 116, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul li {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 auto;\n          flex: 1 0 auto;\n}\n\n/* line 119, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul a {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  text-align: center;\n  color: white;\n  text-decoration: none;\n  font-size: 1.2em;\n  padding: 12px 25px;\n  display: block;\n  border-left: 1px solid rgba(255, 255, 255, 0.2);\n}\n\n@media (max-width: 800px) {\n  /* line 119, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul a {\n    border: 0;\n  }\n}\n\n/* line 133, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul li:last-child a {\n  border-right: 1px solid rgba(255, 255, 255, 0.2);\n}\n\n@media (max-width: 1400px) {\n  /* line 133, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:last-child a {\n    border-right: 0;\n  }\n}\n\n@media (max-width: 800px) {\n  /* line 133, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:last-child a {\n    border: 0;\n  }\n}\n\n@media (max-width: 1400px) {\n  /* line 144, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:first-child a {\n    border-left: 0;\n  }\n}\n\n@media (max-width: 800px) {\n  /* line 144, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:first-child a {\n    border: 0;\n  }\n}\n\n/* line 155, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav .secondary-nav-drop {\n  display: none;\n}\n\n@media (max-width: 800px) {\n  /* line 159, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .menu-secondary-nav-container {\n    position: absolute;\n    z-index: 8;\n  }\n\n  /* line 162, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .menu-secondary-nav-container ul {\n    display: none;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    background: #071825;\n  }\n\n  /* line 168, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .secondary-nav-drop {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 0 auto;\n            flex: 1 0 auto;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    padding: 3.5px;\n    color: white;\n  }\n\n  /* line 173, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .secondary-nav-drop i {\n    font-size: 2.5em;\n  }\n}\n\n/* line 181, resources/assets/styles/layouts/_header.scss */\n\n.inner-menu {\n  width: 100%;\n  max-width: 1400px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin: auto;\n  padding: 0 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 181, resources/assets/styles/layouts/_header.scss */\n\n  .inner-menu {\n    padding: 0;\n  }\n}\n\n/* line 192, resources/assets/styles/layouts/_header.scss */\n\n.search-panel {\n  display: none;\n}\n\n/* line 196, resources/assets/styles/layouts/_header.scss */\n\n.chinese-text {\n  font-size: 1.3em;\n  color: white;\n  padding: 4px 10px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 204, resources/assets/styles/layouts/_header.scss */\n\n.menu-primary-container {\n  position: relative;\n}\n\n/* line 1, resources/assets/styles/layouts/_footer.scss */\n\n.footer-header {\n  font-size: 2em;\n}\n\n/* line 5, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer {\n  background: #722;\n  padding: 20px;\n  color: white;\n}\n\n/* line 9, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer .brand {\n  font-size: 2em;\n  font-weight: bold;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 14, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer .brand img {\n  padding: 2px;\n  max-height: 50px;\n}\n\n/* line 19, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer a {\n  color: white;\n}\n\n/* line 24, resources/assets/styles/layouts/_footer.scss */\n\n.grey-footer {\n  background: #ddd;\n  padding: 40px;\n  color: #222;\n}\n\n@media (max-width: 800px) {\n  /* line 24, resources/assets/styles/layouts/_footer.scss */\n\n  .grey-footer {\n    padding: 40px 20px;\n  }\n}\n\n/* line 33, resources/assets/styles/layouts/_footer.scss */\n\n.seperators {\n  padding: 10px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 36, resources/assets/styles/layouts/_footer.scss */\n\n.seperators > div {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 0px;\n          flex: 1 0 0;\n  padding: 30px;\n  border-left: 1px solid #bbb;\n}\n\n/* line 40, resources/assets/styles/layouts/_footer.scss */\n\n.seperators > div:first-child {\n  border-left: none;\n}\n\n@media (max-width: 800px) {\n  /* line 33, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n\n  /* line 46, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators > div {\n    border: 0;\n    width: 100%;\n    padding: 20px;\n    border-bottom: 1px solid #bbb;\n  }\n\n  /* line 51, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators > div:last-child {\n    border-top: none;\n  }\n}\n\n/* line 58, resources/assets/styles/layouts/_footer.scss */\n\n.stats-title {\n  font-size: 1.8em;\n  font-weight: 600;\n  margin: 0;\n}\n\n/* line 64, resources/assets/styles/layouts/_footer.scss */\n\n.big-number {\n  font-size: 3em;\n  font-weight: 1000;\n  color: #09c;\n}\n\n/* line 70, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 0px;\n          flex: 1 0 0;\n  background: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  margin: 10px;\n}\n\n/* line 76, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-title {\n  font-size: 1.5em;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  background: #0a1e32;\n  padding: 6px;\n}\n\n/* line 83, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container {\n  color: #222;\n  padding: 5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 auto;\n          flex: 1 0 auto;\n}\n\n/* line 92, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container img {\n  padding: 10px;\n  max-height: 100px;\n  height: 100%;\n}\n\n/* line 100, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item {\n  padding: 5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 104, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item .wrapping {\n  padding: 6px;\n  color: #25b;\n  background: white;\n  border-radius: 100px;\n  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n}\n\n/* line 111, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item .contact-text {\n  color: #222;\n  padding-left: 10px;\n  font-size: 1.3em;\n  font-weight: bold;\n  text-align: left;\n}\n\n/* line 120, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container .large-image {\n  max-height: 120px;\n}\n\n/* line 1, resources/assets/styles/layouts/_pages.scss */\n\nhtml {\n  background: #f6f6f6;\n}\n\n/* line 5, resources/assets/styles/layouts/_pages.scss */\n\n.hero {\n  background: transparent;\n}\n\n/* line 7, resources/assets/styles/layouts/_pages.scss */\n\n.hero.dark {\n  background: #222;\n  color: white;\n}\n\n/* line 11, resources/assets/styles/layouts/_pages.scss */\n\n.hero.image {\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n\n/* line 18, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero {\n  margin: auto;\n  max-width: 1400px;\n  width: 100%;\n}\n\n/* line 22, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.image {\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n}\n\n/* line 30, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page {\n  padding: 40px;\n  background: white;\n  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n  font-size: 1.2em;\n}\n\n@media (max-width: 800px) {\n  /* line 30, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.page {\n    padding: 20px;\n  }\n}\n\n/* line 38, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page.max {\n  margin: 0;\n  max-width: none;\n}\n\n/* line 43, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page-text {\n  font-size: 1.2em;\n}\n\n/* line 46, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-none {\n  padding: 10px 30px;\n}\n\n@media (max-width: 800px) {\n  /* line 46, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-none {\n    padding: 10px;\n  }\n}\n\n/* line 52, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-tiny {\n  padding: 20px 30px;\n}\n\n@media (max-width: 800px) {\n  /* line 52, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-tiny {\n    padding: 20px;\n  }\n}\n\n/* line 58, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-small {\n  padding: 5vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 58, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-small {\n    padding: 5vh 10px;\n  }\n}\n\n/* line 64, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-medium {\n  padding: 10vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 64, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-medium {\n    padding: 10vh 10px;\n  }\n}\n\n/* line 70, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-medium-large {\n  padding: 16vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 70, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-medium-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 76, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-large {\n  padding: 25vh 10px;\n}\n\n@media (max-width: 800px) {\n  /* line 76, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-large {\n    padding: 16vh 40px;\n  }\n}\n\n/* line 83, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-none {\n  padding: 10px 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 83, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-none {\n    padding: 10px;\n  }\n}\n\n/* line 89, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-tiny {\n  padding: 20px 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 89, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-tiny {\n    padding: 20px;\n  }\n}\n\n/* line 95, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-small {\n  padding: 5vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 95, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-small {\n    padding: 5vh 10px;\n  }\n}\n\n/* line 101, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-medium {\n  padding: 10vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 101, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-medium {\n    padding: 10vh 10px;\n  }\n}\n\n/* line 107, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-medium-large {\n  padding: 16vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 107, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-medium-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 113, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-large {\n  padding: 25vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 113, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 121, resources/assets/styles/layouts/_pages.scss */\n\n.title {\n  font-size: 3em;\n}\n\n/* line 125, resources/assets/styles/layouts/_pages.scss */\n\n.shadow {\n  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.2);\n}\n\n/* line 129, resources/assets/styles/layouts/_pages.scss */\n\n.featured-text {\n  font-size: 1.5em;\n  max-width: 800px;\n}\n\n/* line 134, resources/assets/styles/layouts/_pages.scss */\n\n.front-page-h2 {\n  font-size: 2.2em;\n  margin: 0;\n  margin-bottom: 30px;\n  font-weight: bold;\n  color: #a11;\n}\n\n/* line 1, resources/assets/styles/layouts/_posts.scss */\n\n.event-box {\n  background: white;\n  margin: 10px;\n  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);\n          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);\n  border-radius: 5px;\n  -webkit-box-flex: 1;\n      -ms-flex: 1 0 100%;\n          flex: 1 0 100%;\n  max-width: 400px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n/* line 10, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .event-background {\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  padding: 70px 10px;\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  font-weight: 600;\n  font-size: 1.4em;\n  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.6);\n}\n\n/* line 26, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .buttons-event {\n  margin-top: auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 10px 0;\n}\n\n/* line 32, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .excerpt {\n  padding: 15px;\n}\n\n/* line 37, resources/assets/styles/layouts/_posts.scss */\n\n.events-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n/* line 44, resources/assets/styles/layouts/_posts.scss */\n\n.time {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 46, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-length {\n  padding-left: 20px;\n  padding-right: 20px;\n  text-align: center;\n}\n\n@media (max-width: 600px) {\n  /* line 46, resources/assets/styles/layouts/_posts.scss */\n\n  .time .time-length {\n    padding-left: 10px;\n    padding-right: 10px;\n  }\n}\n\n/* line 55, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-date {\n  font-size: 4em;\n}\n\n/* line 58, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-text {\n  font-size: 2em;\n}\n\n@media (max-width: 600px) {\n  /* line 58, resources/assets/styles/layouts/_posts.scss */\n\n  .time .time-text {\n    font-size: 1.5em;\n  }\n}\n\n/* line 66, resources/assets/styles/layouts/_posts.scss */\n\n.card {\n  background: white;\n  padding: 20px;\n  -webkit-box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);\n  border-radius: 4px;\n}\n\n", "", {"version":3,"sources":["C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/main.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/main.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/common/_global.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/main.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/components/_buttons.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/components/_forms.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/layouts/_header.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/layouts/_footer.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/layouts/_pages.scss","C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/resources/assets/styles/resources/assets/styles/layouts/_posts.scss"],"names":[],"mappings":"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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n/** Import theme styles */\n/* line 1, resources/assets/styles/common/_global.scss */\nbody {\n  margin: 0; }\n\n/* line 5, resources/assets/styles/common/_global.scss */\n* {\n  box-sizing: border-box; }\n\n/* line 9, resources/assets/styles/common/_global.scss */\na {\n  text-decoration: none;\n  color: #09c; }\n\n/* line 14, resources/assets/styles/common/_global.scss */\nhtml {\n  font-family: 'Lato', sans-serif;\n  color: #222; }\n\n/* line 19, resources/assets/styles/common/_global.scss */\n.flex {\n  display: flex; }\n  @media (max-width: 800px) {\n    /* line 21, resources/assets/styles/common/_global.scss */\n    .flex.mobile {\n      flex-wrap: wrap; } }\n\n/* line 28, resources/assets/styles/common/_global.scss */\n.row {\n  display: flex;\n  flex-flow: row; }\n\n/* line 33, resources/assets/styles/common/_global.scss */\n.column {\n  display: flex;\n  flex-direction: column; }\n\n/* line 38, resources/assets/styles/common/_global.scss */\n.end {\n  align-self: flex-end;\n  margin-left: auto; }\n\n/* line 43, resources/assets/styles/common/_global.scss */\n.flex-align {\n  display: flex;\n  align-items: center; }\n\n/* line 48, resources/assets/styles/common/_global.scss */\n.center {\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n\n/* line 54, resources/assets/styles/common/_global.scss */\n.text-center {\n  text-align: center; }\n\n/* line 58, resources/assets/styles/common/_global.scss */\n.inner-content {\n  width: 100%;\n  max-width: 1400px;\n  display: flex;\n  margin: auto; }\n\n/* line 65, resources/assets/styles/common/_global.scss */\n.flex-left {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start; }\n\n/* line 71, resources/assets/styles/common/_global.scss */\n.wp-block-file {\n  display: flex; }\n  /* line 73, resources/assets/styles/common/_global.scss */\n  .wp-block-file a {\n    font-weight: bold; }\n\n/* line 78, resources/assets/styles/common/_global.scss */\nhr {\n  border: 0;\n  border-bottom: 1px solid #ccc; }\n\n/* line 1, resources/assets/styles/components/_buttons.scss */\n.button {\n  background: #990000;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  margin: 5px; }\n  /* line 12, resources/assets/styles/components/_buttons.scss */\n  .button.secondary {\n    background: #164472; }\n  /* line 15, resources/assets/styles/components/_buttons.scss */\n  .button.search {\n    padding: 5px; }\n  /* line 19, resources/assets/styles/components/_buttons.scss */\n  .button.featured {\n    margin: 15px 0;\n    padding: 10px 20px;\n    font-size: 1.4em; }\n  /* line 24, resources/assets/styles/components/_buttons.scss */\n  .button.bright {\n    background: #b81414; }\n  /* line 27, resources/assets/styles/components/_buttons.scss */\n  .button.box-shadow {\n    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5); }\n  /* line 30, resources/assets/styles/components/_buttons.scss */\n  .button.flat {\n    background: none;\n    color: #c00; }\n    /* line 33, resources/assets/styles/components/_buttons.scss */\n    .button.flat.secondary {\n      color: #164472; }\n  /* line 37, resources/assets/styles/components/_buttons.scss */\n  .button.small-button-text {\n    font-size: 1.1em; }\n\n/* line 1, resources/assets/styles/components/_forms.scss */\ninput, textarea {\n  padding: 10px;\n  border-radius: 4px;\n  border: 0;\n  border: 1px solid #ccc;\n  margin-top: 5px;\n  margin-bottom: 5px;\n  width: 100%;\n  max-width: 400px;\n  font-size: 1em; }\n\n/* line 13, resources/assets/styles/components/_forms.scss */\ninput[type=\"submit\"] {\n  background: #164472;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  text-align: center;\n  width: auto; }\n\n/* line 27, resources/assets/styles/components/_forms.scss */\nform {\n  display: flex;\n  justify-content: center; }\n\n/* line 2, resources/assets/styles/layouts/_header.scss */\nheader .header-container {\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); }\n\n/* line 7, resources/assets/styles/layouts/_header.scss */\n.menu-icon {\n  display: none; }\n  /* line 9, resources/assets/styles/layouts/_header.scss */\n  .menu-icon i {\n    font-size: 1.5em;\n    vertical-align: sub; }\n  /* line 13, resources/assets/styles/layouts/_header.scss */\n  .menu-icon a {\n    color: white;\n    padding: 11.5px;\n    display: flex;\n    height: 100%;\n    justify-content: center;\n    align-items: center; }\n  @media (max-width: 1000px) {\n    /* line 7, resources/assets/styles/layouts/_header.scss */\n    .menu-icon {\n      display: flex; } }\n\n/* line 26, resources/assets/styles/layouts/_header.scss */\n.main-header {\n  background: #A80D0D; }\n  /* line 28, resources/assets/styles/layouts/_header.scss */\n  .main-header .brand {\n    font-size: 2.3em;\n    font-weight: bold;\n    display: flex;\n    align-items: center;\n    padding: 4px 10px; }\n    /* line 34, resources/assets/styles/layouts/_header.scss */\n    .main-header .brand img {\n      max-height: 60px; }\n    @media (max-width: 600px) {\n      /* line 28, resources/assets/styles/layouts/_header.scss */\n      .main-header .brand {\n        font-size: 1.5em; } }\n  /* line 41, resources/assets/styles/layouts/_header.scss */\n  .main-header a {\n    color: white; }\n\n/* line 46, resources/assets/styles/layouts/_header.scss */\n.primary-nav {\n  background: #7E0707; }\n  @media (max-width: 1000px) {\n    /* line 48, resources/assets/styles/layouts/_header.scss */\n    .primary-nav #menu-primary {\n      z-index: 9;\n      position: absolute;\n      display: none;\n      top: 47px;\n      min-width: 250px;\n      right: 0px;\n      background: #5e0505;\n      flex-direction: column; } }\n  /* line 60, resources/assets/styles/layouts/_header.scss */\n  .primary-nav ul {\n    list-style: none;\n    margin: 0;\n    display: flex;\n    padding-left: 0; }\n    /* line 65, resources/assets/styles/layouts/_header.scss */\n    .primary-nav ul a {\n      color: white;\n      text-decoration: none;\n      font-size: 1.2em;\n      padding: 12px 25px;\n      display: block; }\n    @media (max-width: 1000px) {\n      /* line 73, resources/assets/styles/layouts/_header.scss */\n      .primary-nav ul a {\n        padding: 14px 45px;\n        border-bottom: 1px solid #410404; }\n      /* line 78, resources/assets/styles/layouts/_header.scss */\n      .primary-nav ul.menu-item-has-children > a {\n        background: #711414; }\n      /* line 82, resources/assets/styles/layouts/_header.scss */\n      .primary-nav ul.menu-item-has-children .sub-menu a {\n        padding-left: 10px; } }\n  /* line 89, resources/assets/styles/layouts/_header.scss */\n  .primary-nav .sub-menu {\n    display: none;\n    position: absolute;\n    background: #660606;\n    flex-direction: column; }\n    @media (max-width: 1000px) {\n      /* line 89, resources/assets/styles/layouts/_header.scss */\n      .primary-nav .sub-menu {\n        display: flex;\n        position: relative; } }\n  /* line 99, resources/assets/styles/layouts/_header.scss */\n  .primary-nav .menu-item-has-children > a:after {\n    color: #fff;\n    content: '▾'; }\n\n/* line 105, resources/assets/styles/layouts/_header.scss */\n.secondary-nav {\n  background: #0B253B; }\n  /* line 107, resources/assets/styles/layouts/_header.scss */\n  .secondary-nav .menu-secondary-nav-container {\n    width: 100%; }\n  /* line 110, resources/assets/styles/layouts/_header.scss */\n  .secondary-nav ul {\n    list-style: none;\n    margin: 0;\n    display: flex;\n    padding-left: 0;\n    flex: 1 0 auto; }\n    /* line 116, resources/assets/styles/layouts/_header.scss */\n    .secondary-nav ul li {\n      flex: 1 0 auto; }\n    /* line 119, resources/assets/styles/layouts/_header.scss */\n    .secondary-nav ul a {\n      display: flex;\n      text-align: center;\n      color: white;\n      text-decoration: none;\n      font-size: 1.2em;\n      padding: 12px 25px;\n      display: block;\n      border-left: 1px solid rgba(255, 255, 255, 0.2); }\n      @media (max-width: 800px) {\n        /* line 119, resources/assets/styles/layouts/_header.scss */\n        .secondary-nav ul a {\n          border: 0; } }\n    /* line 133, resources/assets/styles/layouts/_header.scss */\n    .secondary-nav ul li:last-child a {\n      border-right: 1px solid rgba(255, 255, 255, 0.2); }\n      @media (max-width: 1400px) {\n        /* line 133, resources/assets/styles/layouts/_header.scss */\n        .secondary-nav ul li:last-child a {\n          border-right: 0; } }\n      @media (max-width: 800px) {\n        /* line 133, resources/assets/styles/layouts/_header.scss */\n        .secondary-nav ul li:last-child a {\n          border: 0; } }\n    @media (max-width: 1400px) {\n      /* line 144, resources/assets/styles/layouts/_header.scss */\n      .secondary-nav ul li:first-child a {\n        border-left: 0; } }\n    @media (max-width: 800px) {\n      /* line 144, resources/assets/styles/layouts/_header.scss */\n      .secondary-nav ul li:first-child a {\n        border: 0; } }\n  /* line 155, resources/assets/styles/layouts/_header.scss */\n  .secondary-nav .secondary-nav-drop {\n    display: none; }\n  @media (max-width: 800px) {\n    /* line 159, resources/assets/styles/layouts/_header.scss */\n    .secondary-nav .menu-secondary-nav-container {\n      position: absolute;\n      z-index: 8; }\n      /* line 162, resources/assets/styles/layouts/_header.scss */\n      .secondary-nav .menu-secondary-nav-container ul {\n        display: none;\n        flex-direction: column;\n        background: #071825; }\n    /* line 168, resources/assets/styles/layouts/_header.scss */\n    .secondary-nav .secondary-nav-drop {\n      display: flex;\n      flex: 1 0 auto;\n      justify-content: center;\n      padding: 3.5px;\n      color: white; }\n      /* line 173, resources/assets/styles/layouts/_header.scss */\n      .secondary-nav .secondary-nav-drop i {\n        font-size: 2.5em; } }\n\n/* line 181, resources/assets/styles/layouts/_header.scss */\n.inner-menu {\n  width: 100%;\n  max-width: 1400px;\n  display: flex;\n  margin: auto;\n  padding: 0 40px; }\n  @media (max-width: 800px) {\n    /* line 181, resources/assets/styles/layouts/_header.scss */\n    .inner-menu {\n      padding: 0; } }\n\n/* line 192, resources/assets/styles/layouts/_header.scss */\n.search-panel {\n  display: none; }\n\n/* line 196, resources/assets/styles/layouts/_header.scss */\n.chinese-text {\n  font-size: 1.3em;\n  color: white;\n  padding: 4px 10px;\n  display: flex;\n  align-items: center; }\n\n/* line 204, resources/assets/styles/layouts/_header.scss */\n.menu-primary-container {\n  position: relative; }\n\n/* line 1, resources/assets/styles/layouts/_footer.scss */\n.footer-header {\n  font-size: 2em; }\n\n/* line 5, resources/assets/styles/layouts/_footer.scss */\n.final-footer {\n  background: #722;\n  padding: 20px;\n  color: white; }\n  /* line 9, resources/assets/styles/layouts/_footer.scss */\n  .final-footer .brand {\n    font-size: 2em;\n    font-weight: bold;\n    display: flex;\n    align-items: center; }\n    /* line 14, resources/assets/styles/layouts/_footer.scss */\n    .final-footer .brand img {\n      padding: 2px;\n      max-height: 50px; }\n  /* line 19, resources/assets/styles/layouts/_footer.scss */\n  .final-footer a {\n    color: white; }\n\n/* line 24, resources/assets/styles/layouts/_footer.scss */\n.grey-footer {\n  background: #ddd;\n  padding: 40px;\n  color: #222; }\n  @media (max-width: 800px) {\n    /* line 24, resources/assets/styles/layouts/_footer.scss */\n    .grey-footer {\n      padding: 40px 20px; } }\n\n/* line 33, resources/assets/styles/layouts/_footer.scss */\n.seperators {\n  padding: 10px;\n  display: flex; }\n  /* line 36, resources/assets/styles/layouts/_footer.scss */\n  .seperators > div {\n    flex: 1 0 0;\n    padding: 30px;\n    border-left: 1px solid #bbb; }\n    /* line 40, resources/assets/styles/layouts/_footer.scss */\n    .seperators > div:first-child {\n      border-left: none; }\n  @media (max-width: 800px) {\n    /* line 33, resources/assets/styles/layouts/_footer.scss */\n    .seperators {\n      flex-direction: column; }\n      /* line 46, resources/assets/styles/layouts/_footer.scss */\n      .seperators > div {\n        border: 0;\n        width: 100%;\n        padding: 20px;\n        border-bottom: 1px solid #bbb; }\n        /* line 51, resources/assets/styles/layouts/_footer.scss */\n        .seperators > div:last-child {\n          border-top: none; } }\n\n/* line 58, resources/assets/styles/layouts/_footer.scss */\n.stats-title {\n  font-size: 1.8em;\n  font-weight: 600;\n  margin: 0; }\n\n/* line 64, resources/assets/styles/layouts/_footer.scss */\n.big-number {\n  font-size: 3em;\n  font-weight: 1000;\n  color: #09c; }\n\n/* line 70, resources/assets/styles/layouts/_footer.scss */\n.sponsor-box {\n  flex: 1 0 0;\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  margin: 10px; }\n  /* line 76, resources/assets/styles/layouts/_footer.scss */\n  .sponsor-box .sponsor-title {\n    font-size: 1.5em;\n    display: flex;\n    justify-content: center;\n    background: #0a1e32;\n    padding: 6px; }\n  /* line 83, resources/assets/styles/layouts/_footer.scss */\n  .sponsor-box .sponsor-container {\n    color: #222;\n    padding: 5px;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: center;\n    flex: 1 0 auto; }\n    /* line 92, resources/assets/styles/layouts/_footer.scss */\n    .sponsor-box .sponsor-container img {\n      padding: 10px;\n      max-height: 100px;\n      height: 100%; }\n\n/* line 100, resources/assets/styles/layouts/_footer.scss */\n.contact-item {\n  padding: 5px;\n  display: flex;\n  align-items: center; }\n  /* line 104, resources/assets/styles/layouts/_footer.scss */\n  .contact-item .wrapping {\n    padding: 6px;\n    color: #25b;\n    background: white;\n    border-radius: 100px;\n    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2); }\n  /* line 111, resources/assets/styles/layouts/_footer.scss */\n  .contact-item .contact-text {\n    color: #222;\n    padding-left: 10px;\n    font-size: 1.3em;\n    font-weight: bold;\n    text-align: left; }\n\n/* line 120, resources/assets/styles/layouts/_footer.scss */\n.sponsor-box .sponsor-container .large-image {\n  max-height: 120px; }\n\n/* line 1, resources/assets/styles/layouts/_pages.scss */\nhtml {\n  background: #f6f6f6; }\n\n/* line 5, resources/assets/styles/layouts/_pages.scss */\n.hero {\n  background: transparent; }\n  /* line 7, resources/assets/styles/layouts/_pages.scss */\n  .hero.dark {\n    background: #222;\n    color: white; }\n  /* line 11, resources/assets/styles/layouts/_pages.scss */\n  .hero.image {\n    background: #333;\n    color: white;\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: cover; }\n  /* line 18, resources/assets/styles/layouts/_pages.scss */\n  .hero .inner-hero {\n    margin: auto;\n    max-width: 1400px;\n    width: 100%; }\n    /* line 22, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.image {\n      background: #333;\n      color: white;\n      background-position: center;\n      background-repeat: no-repeat;\n      background-size: cover;\n      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2); }\n    /* line 30, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.page {\n      padding: 40px;\n      background: white;\n      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n      font-size: 1.2em; }\n      @media (max-width: 800px) {\n        /* line 30, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.page {\n          padding: 20px; } }\n      /* line 38, resources/assets/styles/layouts/_pages.scss */\n      .hero .inner-hero.page.max {\n        margin: 0;\n        max-width: none; }\n    /* line 43, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.page-text {\n      font-size: 1.2em; }\n    /* line 46, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-none {\n      padding: 10px 30px; }\n      @media (max-width: 800px) {\n        /* line 46, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-none {\n          padding: 10px; } }\n    /* line 52, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-tiny {\n      padding: 20px 30px; }\n      @media (max-width: 800px) {\n        /* line 52, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-tiny {\n          padding: 20px; } }\n    /* line 58, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-small {\n      padding: 5vh 40px; }\n      @media (max-width: 800px) {\n        /* line 58, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-small {\n          padding: 5vh 10px; } }\n    /* line 64, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-medium {\n      padding: 10vh 40px; }\n      @media (max-width: 800px) {\n        /* line 64, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-medium {\n          padding: 10vh 10px; } }\n    /* line 70, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-medium-large {\n      padding: 16vh 40px; }\n      @media (max-width: 800px) {\n        /* line 70, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-medium-large {\n          padding: 16vh 10px; } }\n    /* line 76, resources/assets/styles/layouts/_pages.scss */\n    .hero .inner-hero.padding-large {\n      padding: 25vh 10px; }\n      @media (max-width: 800px) {\n        /* line 76, resources/assets/styles/layouts/_pages.scss */\n        .hero .inner-hero.padding-large {\n          padding: 16vh 40px; } }\n  /* line 83, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-none {\n    padding: 10px 40px; }\n    @media (max-width: 800px) {\n      /* line 83, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-none {\n        padding: 10px; } }\n  /* line 89, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-tiny {\n    padding: 20px 40px; }\n    @media (max-width: 800px) {\n      /* line 89, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-tiny {\n        padding: 20px; } }\n  /* line 95, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-small {\n    padding: 5vh 50px; }\n    @media (max-width: 800px) {\n      /* line 95, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-small {\n        padding: 5vh 10px; } }\n  /* line 101, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-medium {\n    padding: 10vh 50px; }\n    @media (max-width: 800px) {\n      /* line 101, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-medium {\n        padding: 10vh 10px; } }\n  /* line 107, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-medium-large {\n    padding: 16vh 50px; }\n    @media (max-width: 800px) {\n      /* line 107, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-medium-large {\n        padding: 16vh 10px; } }\n  /* line 113, resources/assets/styles/layouts/_pages.scss */\n  .hero.padding-large {\n    padding: 25vh 40px; }\n    @media (max-width: 800px) {\n      /* line 113, resources/assets/styles/layouts/_pages.scss */\n      .hero.padding-large {\n        padding: 16vh 10px; } }\n\n/* line 121, resources/assets/styles/layouts/_pages.scss */\n.title {\n  font-size: 3em; }\n\n/* line 125, resources/assets/styles/layouts/_pages.scss */\n.shadow {\n  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.2); }\n\n/* line 129, resources/assets/styles/layouts/_pages.scss */\n.featured-text {\n  font-size: 1.5em;\n  max-width: 800px; }\n\n/* line 134, resources/assets/styles/layouts/_pages.scss */\n.front-page-h2 {\n  font-size: 2.2em;\n  margin: 0;\n  margin-bottom: 30px;\n  font-weight: bold;\n  color: #a11; }\n\n/* line 1, resources/assets/styles/layouts/_posts.scss */\n.event-box {\n  background: white;\n  margin: 10px;\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);\n  border-radius: 5px;\n  flex: 1 0 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column; }\n  /* line 10, resources/assets/styles/layouts/_posts.scss */\n  .event-box .event-background {\n    border-top-left-radius: 5px;\n    border-top-right-radius: 5px;\n    padding: 70px 10px;\n    background: #333;\n    color: white;\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: cover;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-weight: 600;\n    font-size: 1.4em;\n    text-shadow: 0 0 2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.6); }\n  /* line 26, resources/assets/styles/layouts/_posts.scss */\n  .event-box .buttons-event {\n    margin-top: auto;\n    display: flex;\n    justify-content: center;\n    padding: 10px 0; }\n  /* line 32, resources/assets/styles/layouts/_posts.scss */\n  .event-box .excerpt {\n    padding: 15px; }\n\n/* line 37, resources/assets/styles/layouts/_posts.scss */\n.events-container {\n  display: flex;\n  width: 100%;\n  justify-content: center;\n  flex-wrap: wrap; }\n\n/* line 44, resources/assets/styles/layouts/_posts.scss */\n.time {\n  display: flex; }\n  /* line 46, resources/assets/styles/layouts/_posts.scss */\n  .time .time-length {\n    padding-left: 20px;\n    padding-right: 20px;\n    text-align: center; }\n    @media (max-width: 600px) {\n      /* line 46, resources/assets/styles/layouts/_posts.scss */\n      .time .time-length {\n        padding-left: 10px;\n        padding-right: 10px; } }\n  /* line 55, resources/assets/styles/layouts/_posts.scss */\n  .time .time-date {\n    font-size: 4em; }\n  /* line 58, resources/assets/styles/layouts/_posts.scss */\n  .time .time-text {\n    font-size: 2em; }\n    @media (max-width: 600px) {\n      /* line 58, resources/assets/styles/layouts/_posts.scss */\n      .time .time-text {\n        font-size: 1.5em; } }\n\n/* line 66, resources/assets/styles/layouts/_posts.scss */\n.card {\n  background: white;\n  padding: 20px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);\n  border-radius: 4px; }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9hc3NldHMvc3R5bGVzL21haW4uc2NzcyIsInJlc291cmNlcy9hc3NldHMvc3R5bGVzL2NvbW1vbi9fdmFyaWFibGVzLnNjc3MiLCJyZXNvdXJjZXMvYXNzZXRzL3N0eWxlcy9jb21tb24vX2dsb2JhbC5zY3NzIiwicmVzb3VyY2VzL2Fzc2V0cy9zdHlsZXMvY29tcG9uZW50cy9fYnV0dG9ucy5zY3NzIiwicmVzb3VyY2VzL2Fzc2V0cy9zdHlsZXMvY29tcG9uZW50cy9fY29tbWVudHMuc2NzcyIsInJlc291cmNlcy9hc3NldHMvc3R5bGVzL2NvbXBvbmVudHMvX2Zvcm1zLnNjc3MiLCJyZXNvdXJjZXMvYXNzZXRzL3N0eWxlcy9jb21wb25lbnRzL193cC1jbGFzc2VzLnNjc3MiLCJyZXNvdXJjZXMvYXNzZXRzL3N0eWxlcy9sYXlvdXRzL19oZWFkZXIuc2NzcyIsInJlc291cmNlcy9hc3NldHMvc3R5bGVzL2xheW91dHMvX3NpZGViYXIuc2NzcyIsInJlc291cmNlcy9hc3NldHMvc3R5bGVzL2xheW91dHMvX2Zvb3Rlci5zY3NzIiwicmVzb3VyY2VzL2Fzc2V0cy9zdHlsZXMvbGF5b3V0cy9fcGFnZXMuc2NzcyIsInJlc291cmNlcy9hc3NldHMvc3R5bGVzL2xheW91dHMvX3Bvc3RzLnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcImNvbW1vbi92YXJpYWJsZXNcIjtcblxuLyoqIEltcG9ydCB0aGVtZSBzdHlsZXMgKi9cbkBpbXBvcnQgXCJjb21tb24vZ2xvYmFsXCI7XG5AaW1wb3J0IFwiY29tcG9uZW50cy9idXR0b25zXCI7XG5AaW1wb3J0IFwiY29tcG9uZW50cy9jb21tZW50c1wiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvZm9ybXNcIjtcbkBpbXBvcnQgXCJjb21wb25lbnRzL3dwLWNsYXNzZXNcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2hlYWRlclwiO1xuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xuQGltcG9ydCBcImxheW91dHMvZm9vdGVyXCI7XG5AaW1wb3J0IFwibGF5b3V0cy9wYWdlc1wiO1xuQGltcG9ydCBcImxheW91dHMvcG9zdHNcIjtcbiIsIiRkZXNrdG9wOiAxNDAwcHg7XG4kbGFwdG9wOiAxMDAwcHg7XG4kdGFibGV0OiA4MDBweDtcbiRwaG9uZTogNjAwcHg7XG5cbiRtYWludGhlbWU6ICNjMDA7XG4kc2Vjb25kYXJ5dGhlbWU6IHJnYigyMiwgNjgsIDExNCk7IiwiYm9keXtcclxuICAgIG1hcmdpbjogMDtcclxufVxyXG5cclxuKntcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbmEge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgY29sb3I6ICMwOWM7XHJcbn1cclxuXHJcbmh0bWx7XHJcbiAgICBmb250LWZhbWlseTogJ0xhdG8nLCBzYW5zLXNlcmlmO1xyXG4gICAgY29sb3I6ICMyMjI7XHJcbn1cclxuXHJcbi5mbGV4IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAmLm1vYmlsZSB7XHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6ICR0YWJsZXQpIHtcclxuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLnJvd3tcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWZsb3c6IHJvdztcclxufVxyXG5cclxuLmNvbHVtbntcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG59XHJcblxyXG4uZW5kIHtcclxuICAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xyXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbn1cclxuXHJcbi5mbGV4LWFsaWdue1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5jZW50ZXJ7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4udGV4dC1jZW50ZXJ7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5pbm5lci1jb250ZW50e1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBtYXgtd2lkdGg6ICRkZXNrdG9wO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIG1hcmdpbjogYXV0bztcclxufVxyXG5cclxuLmZsZXgtbGVmdHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XHJcbn1cclxuXHJcbi53cC1ibG9jay1maWxle1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGF7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmhye1xyXG4gICAgYm9yZGVyOiAwO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XHJcbn1cclxuXHJcbiIsIi5idXR0b257XHJcbiAgICBiYWNrZ3JvdW5kOiBkYXJrZW4oJG1haW50aGVtZSwgMTAlKTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHBhZGRpbmc6IDhweCAxNHB4O1xyXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICBmb250LXNpemU6IDEuMmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIG1hcmdpbjogNXB4O1xyXG4gICAgJi5zZWNvbmRhcnl7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJHNlY29uZGFyeXRoZW1lO1xyXG4gICAgfVxyXG4gICAgJi5zZWFyY2h7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgfVxyXG5cclxuICAgICYuZmVhdHVyZWR7XHJcbiAgICAgICAgbWFyZ2luOiAxNXB4IDA7XHJcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMS40ZW07XHJcbiAgICB9XHJcbiAgICAmLmJyaWdodHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBkZXNhdHVyYXRlKCRtYWludGhlbWUsIDIwJSk7XHJcbiAgICB9XHJcbiAgICAmLmJveC1zaGFkb3d7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDhweCAycHggcmdiYSgwLDAsMCwwLjUpO1xyXG4gICAgfVxyXG4gICAgJi5mbGF0e1xyXG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICAgICAgY29sb3I6ICRtYWludGhlbWU7XHJcbiAgICAgICAgJi5zZWNvbmRhcnkge1xyXG4gICAgICAgICAgICBjb2xvcjogJHNlY29uZGFyeXRoZW1lXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgJi5zbWFsbC1idXR0b24tdGV4dHtcclxuICAgICAgICBmb250LXNpemU6IDEuMWVtO1xyXG4gICAgfVxyXG59IiwiIiwiaW5wdXQsIHRleHRhcmVhe1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgICBtYXJnaW4tdG9wOiA1cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG1heC13aWR0aDogNDAwcHg7XHJcbiAgICBmb250LXNpemU6IDFlbTtcclxufVxyXG5cclxuaW5wdXRbdHlwZT1cInN1Ym1pdFwiXXtcclxuICAgIGJhY2tncm91bmQ6ICRzZWNvbmRhcnl0aGVtZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHBhZGRpbmc6IDhweCAxNHB4O1xyXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICBmb250LXNpemU6IDEuMmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHdpZHRoOiBhdXRvO1xyXG59XHJcblxyXG5mb3Jte1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59IiwiIiwiaGVhZGVyIHtcbiAgLmhlYWRlci1jb250YWluZXIge1xuICAgIGJveC1zaGFkb3c6IDAgMCA1cHggcmdiYSgwLCAwLCAwLCAwLjMpO1xuICB9XG59XG5cbi5tZW51LWljb257XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGl7XG4gICAgZm9udC1zaXplOiAxLjVlbTtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogc3ViO1xuICB9XG4gIGF7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIHBhZGRpbmc6IDExLjVweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB9XG4gIEBtZWRpYSAobWF4LXdpZHRoOiAkbGFwdG9wKSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgfVxufVxuXG4ubWFpbi1oZWFkZXJ7XG4gIGJhY2tncm91bmQ6ICNBODBEMEQ7XG4gIC5icmFuZHtcbiAgICBmb250LXNpemU6IDIuM2VtO1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBwYWRkaW5nOiA0cHggMTBweDtcbiAgICBpbWd7XG4gICAgICBtYXgtaGVpZ2h0OiA2MHB4O1xuICAgIH1cbiAgICBAbWVkaWEgKG1heC13aWR0aDogJHBob25lKSB7XG4gICAgICBmb250LXNpemU6IDEuNWVtO1xuICAgIH1cbiAgfVxuICBhe1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgfVxufVxuXG4ucHJpbWFyeS1uYXYge1xuICBiYWNrZ3JvdW5kOiAjN0UwNzA3O1xuICAjbWVudS1wcmltYXJ5IHtcbiAgICBAbWVkaWEgKG1heC13aWR0aDogJGxhcHRvcCkge1xuICAgICAgei1pbmRleDogOTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB0b3A6IDQ3cHg7XG4gICAgICBtaW4td2lkdGg6IDI1MHB4O1xuICAgICAgcmlnaHQ6IDBweDtcbiAgICAgIGJhY2tncm91bmQ6IHJnYig5NCwgNSwgNSk7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cbiAgfVxuICB1bHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgICBhIHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgIGZvbnQtc2l6ZTogMS4yZW07XG4gICAgICBwYWRkaW5nOiAxMnB4IDI1cHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gICAgQG1lZGlhIChtYXgtd2lkdGg6ICRsYXB0b3ApIHtcbiAgICAgIGF7XG4gICAgICAgIHBhZGRpbmc6IDE0cHggNDVweDtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYig2NSwgNCwgNCk7XG4gICAgICB9XG4gICAgICAmLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW57XG4gICAgICAgID4gYXtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBkZXNhdHVyYXRlKCM3RTA3MDcsIDIwJSlcbiAgICAgICAgfVxuICAgICAgICAuc3ViLW1lbnV7XG4gICAgICAgICAgYXtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMTBweDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLnN1Yi1tZW51e1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJhY2tncm91bmQ6IGRhcmtlbigjN0UwNzA3LCA1JSk7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBAbWVkaWEgKG1heC13aWR0aDogJGxhcHRvcCkge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB9XG4gIH1cbiAgLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhOmFmdGVyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBjb250ZW50OiAn4pa+JztcbiAgfVxufVxuXG4uc2Vjb25kYXJ5LW5hdiB7XG4gIGJhY2tncm91bmQ6IzBCMjUzQjtcbiAgLm1lbnUtc2Vjb25kYXJ5LW5hdi1jb250YWluZXJ7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgdWx7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgZmxleDogMSAwIGF1dG87XG4gICAgbGl7XG4gICAgICBmbGV4OiAxIDAgYXV0bztcbiAgICB9XG4gICAgYSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgZm9udC1zaXplOiAxLjJlbTtcbiAgICAgIHBhZGRpbmc6IDEycHggMjVweDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMik7XG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xuICAgICAgICBib3JkZXI6IDA7XG4gICAgICB9XG4gICAgfVxuICAgIGxpOmxhc3QtY2hpbGQge1xuICAgICAgYSB7XG4gICAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKTtcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6ICRkZXNrdG9wKSB7XG4gICAgICAgICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgICAgICB9XG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XG4gICAgICAgICAgYm9yZGVyOiAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxpOmZpcnN0LWNoaWxkIHtcbiAgICAgIGF7XG4gICAgICAgIFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJGRlc2t0b3ApIHtcbiAgICAgICAgICBib3JkZXItbGVmdDogMDtcbiAgICAgICAgfVxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xuICAgICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAuc2Vjb25kYXJ5LW5hdi1kcm9we1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgQG1lZGlhIChtYXgtd2lkdGg6ICR0YWJsZXQpIHtcbiAgICAubWVudS1zZWNvbmRhcnktbmF2LWNvbnRhaW5lcntcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHotaW5kZXg6IDg7XG4gICAgICB1bHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiKDcsIDI0LCAzNyk7XG4gICAgICB9XG4gICAgfVxuICAgIC5zZWNvbmRhcnktbmF2LWRyb3B7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleDogMSAwIGF1dG87XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIHBhZGRpbmc6IDMuNXB4O1xuICAgICAgaXtcbiAgICAgICAgZm9udC1zaXplOiAyLjVlbTtcbiAgICAgIH1cbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIH1cbn1cblxuLmlubmVyLW1lbnV7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6ICRkZXNrdG9wO1xuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW46IGF1dG87XG4gIHBhZGRpbmc6IDAgNDBweDtcbiAgQG1lZGlhIChtYXgtd2lkdGg6ICR0YWJsZXQpIHtcbiAgICBwYWRkaW5nOiAwXG4gIH1cbn1cblxuLnNlYXJjaC1wYW5lbHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmNoaW5lc2UtdGV4dHtcbiAgZm9udC1zaXplOiAxLjNlbTtcbiAgY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nOiA0cHggMTBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLm1lbnUtcHJpbWFyeS1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59IiwiIiwiLmZvb3Rlci1oZWFkZXJ7XHJcbiAgICBmb250LXNpemU6IDJlbTtcclxufVxyXG5cclxuLmZpbmFsLWZvb3RlcntcclxuICAgIGJhY2tncm91bmQ6ICM3MjI7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgLmJyYW5ke1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMmVtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBpbWd7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDJweDtcclxuICAgICAgICAgICAgbWF4LWhlaWdodDogNTBweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhe1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxufVxyXG5cclxuLmdyZXktZm9vdGVye1xyXG4gICAgYmFja2dyb3VuZDogI2RkZDtcclxuICAgIHBhZGRpbmc6IDQwcHg7XHJcbiAgICBjb2xvcjogIzIyMjtcclxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgcGFkZGluZzogNDBweCAyMHB4O1xyXG4gICAgfVxyXG59XHJcblxyXG4uc2VwZXJhdG9yc3tcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgPiBkaXYge1xyXG4gICAgICAgIGZsZXg6IDEgMCAwO1xyXG4gICAgICAgIHBhZGRpbmc6IDMwcHg7XHJcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjYmJiO1xyXG4gICAgICAgICY6Zmlyc3QtY2hpbGR7XHJcbiAgICAgICAgICAgIGJvcmRlci1sZWZ0OiBub25lXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6ICR0YWJsZXQpIHtcclxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgID4gZGl2e1xyXG4gICAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2JiYjtcclxuICAgICAgICAgICAgJjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgICAgICAgIGJvcmRlci10b3A6IG5vbmU7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4uc3RhdHMtdGl0bGV7XHJcbiAgICBmb250LXNpemU6IDEuOGVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIG1hcmdpbjogMDtcclxufVxyXG5cclxuLmJpZy1udW1iZXJ7XHJcbiAgICBmb250LXNpemU6IDNlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiAxMDAwO1xyXG4gICAgY29sb3I6ICMwOWNcclxufVxyXG5cclxuLnNwb25zb3ItYm94e1xyXG4gICAgZmxleDogMSAwIDA7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBtYXJnaW46IDEwcHg7XHJcbiAgICAuc3BvbnNvci10aXRsZXtcclxuICAgICAgICBmb250LXNpemU6IDEuNWVtO1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgYmFja2dyb3VuZDogZGFya2VuKCRzZWNvbmRhcnl0aGVtZSwgMTUlKTtcclxuICAgICAgICBwYWRkaW5nOiA2cHg7XHJcbiAgICB9XHJcbiAgICAuc3BvbnNvci1jb250YWluZXJ7XHJcbiAgICAgICAgY29sb3I6ICMyMjI7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICBmbGV4OiAxIDAgYXV0bztcclxuICAgICAgICBpbWd7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDEwMHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4uY29udGFjdC1pdGVte1xyXG4gICAgcGFkZGluZzogNXB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAud3JhcHBpbmd7XHJcbiAgICAgICAgcGFkZGluZzogNnB4O1xyXG4gICAgICAgIGNvbG9yOiAjMjViO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwMHB4O1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgMCA1cHggMCByZ2JhKDAsMCwwLDAuMik7XHJcbiAgICB9XHJcbiAgICAuY29udGFjdC10ZXh0e1xyXG4gICAgICAgIGNvbG9yOiAjMjIyO1xyXG4gICAgICAgIHBhZGRpbmctbGVmdDogMTBweDtcclxuICAgICAgICBmb250LXNpemU6IDEuM2VtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi5zcG9uc29yLWJveCAgLnNwb25zb3ItY29udGFpbmVyIC5sYXJnZS1pbWFnZXtcclxuICAgIG1heC1oZWlnaHQ6IDEyMHB4O1xyXG59IiwiaHRtbHtcclxuICAgIGJhY2tncm91bmQ6ICNmNmY2ZjY7XHJcbn1cclxuXHJcbi5oZXJve1xyXG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICAmLmRhcmt7XHJcbiAgICAgICAgYmFja2dyb3VuZDogIzIyMjtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9XHJcbiAgICAmLmltYWdle1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICMzMzM7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xyXG4gICAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICB9XHJcbiAgICAuaW5uZXItaGVyb3tcclxuICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgbWF4LXdpZHRoOiAkZGVza3RvcDtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAmLmltYWdle1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMzMzO1xyXG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDVweCAwIHJnYmEoMCwwLDAsMC4yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJi5wYWdle1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0MHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDVweCAwIHJnYmEoMCwwLDAsMC4yKTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6ICR0YWJsZXQpIHtcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJi5tYXh7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IG5vbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJi5wYWdlLXRleHR7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgICYucGFkZGluZy1ub25le1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDMwcHg7XHJcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICYucGFkZGluZy10aW55e1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDMwcHg7XHJcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICYucGFkZGluZy1zbWFsbHtcclxuICAgICAgICAgICAgcGFkZGluZzogNXZoIDQwcHg7XHJcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiA1dmggMTBweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAmLnBhZGRpbmctbWVkaXVte1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHZoIDQwcHg7XHJcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMHZoIDEwcHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJi5wYWRkaW5nLW1lZGl1bS1sYXJnZXtcclxuICAgICAgICAgICAgcGFkZGluZzogMTZ2aCA0MHB4O1xyXG4gICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTZ2aCAxMHB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICYucGFkZGluZy1sYXJnZXtcclxuICAgICAgICAgICAgcGFkZGluZzogMjV2aCAxMHB4O1xyXG4gICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTZ2aCA0MHB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgJi5wYWRkaW5nLW5vbmV7XHJcbiAgICAgICAgcGFkZGluZzogMTBweCA0MHB4O1xyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgJi5wYWRkaW5nLXRpbnl7XHJcbiAgICAgICAgcGFkZGluZzogMjBweCA0MHB4O1xyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgJi5wYWRkaW5nLXNtYWxse1xyXG4gICAgICAgIHBhZGRpbmc6IDV2aCA1MHB4O1xyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDV2aCAxMHB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICYucGFkZGluZy1tZWRpdW17XHJcbiAgICAgICAgcGFkZGluZzogMTB2aCA1MHB4O1xyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkdGFibGV0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwdmggMTBweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAmLnBhZGRpbmctbWVkaXVtLWxhcmdle1xyXG4gICAgICAgIHBhZGRpbmc6IDE2dmggNTBweDtcclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNnZoIDEwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgJi5wYWRkaW5nLWxhcmdle1xyXG4gICAgICAgIHBhZGRpbmc6IDI1dmggNDBweDtcclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogJHRhYmxldCkge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNnZoIDEwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4udGl0bGV7XHJcbiAgICBmb250LXNpemU6IDNlbTtcclxufVxyXG5cclxuLnNoYWRvd3tcclxuICAgIHRleHQtc2hhZG93OiAwIDAgNnB4IHJnYmEoMCwwLDAsMC40KSwgMCAwIDJweCByZ2JhKDAsMCwwLDAuMik7XHJcbn1cclxuXHJcbi5mZWF0dXJlZC10ZXh0e1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIG1heC13aWR0aDogODAwcHg7XHJcbn1cclxuXHJcbi5mcm9udC1wYWdlLWgye1xyXG4gICAgZm9udC1zaXplOiAyLjJlbTtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiAjYTExO1xyXG59XHJcblxyXG4iLCIuZXZlbnQtYm94IHtcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgbWFyZ2luOiAxMHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAycHggNXB4IDAgcmdiYSgwLDAsMCwwLjMpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgZmxleDogMSAwIDEwMCU7XHJcbiAgICBtYXgtd2lkdGg6IDQwMHB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAuZXZlbnQtYmFja2dyb3VuZHtcclxuICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1cHg7XHJcbiAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDVweDtcclxuICAgICAgICBwYWRkaW5nOiA3MHB4IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZDogIzMzMztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xyXG4gICAgICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XHJcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICBmb250LXNpemU6IDEuNGVtO1xyXG4gICAgICAgIHRleHQtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwwLDAsMC42KSwgMCAwIDEwcHggcmdiYSgwLDAsMCwwLjYpO1xyXG4gICAgfVxyXG4gICAgLmJ1dHRvbnMtZXZlbnR7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogYXV0bztcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDEwcHggMDtcclxuICAgIH1cclxuICAgIC5leGNlcnB0e1xyXG4gICAgICAgIHBhZGRpbmc6IDE1cHg7XHJcbiAgICB9XHJcbn1cclxuXHJcbi5ldmVudHMtY29udGFpbmVye1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi50aW1le1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIC50aW1lLWxlbmd0aHtcclxuICAgICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XHJcbiAgICAgICAgcGFkZGluZy1yaWdodDogMjBweDtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6ICRwaG9uZSkge1xyXG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDEwcHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLnRpbWUtZGF0ZXtcclxuICAgICAgICBmb250LXNpemU6IDRlbTtcclxuICAgIH1cclxuICAgIC50aW1lLXRleHR7XHJcbiAgICAgICAgZm9udC1zaXplOiAyZW07XHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6ICRwaG9uZSkge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEuNWVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLmNhcmQge1xyXG4gICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAwIDZweCAwIHJnYmEoMCwwLDAsMC4yKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxufSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsMEJBQTBCOztBRUYxQixBQUFBLElBQUksQ0FBQTtFQUNBLE1BQU0sRUFBRSxDQUFDLEdBQ1o7OztBQUVELEFBQUEsQ0FBQyxDQUFBO0VBQ0csVUFBVSxFQUFFLFVBQVUsR0FDekI7OztBQUVELEFBQUEsQ0FBQyxDQUFDO0VBQ0UsZUFBZSxFQUFFLElBQUk7RUFDckIsS0FBSyxFQUFFLElBQUksR0FDZDs7O0FBRUQsQUFBQSxJQUFJLENBQUE7RUFDQSxXQUFXLEVBQUUsa0JBQWtCO0VBQy9CLEtBQUssRUFBRSxJQUFJLEdBQ2Q7OztBQUVELEFBQUEsS0FBSyxDQUFDO0VBQ0YsT0FBTyxFQUFFLElBQUksR0FNaEI7RUFKTyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUs7O0lBSGhDLEFBRUksS0FGQyxBQUVBLE9BQU8sQ0FBQztNQUVELFNBQVMsRUFBRSxJQUFJLEdBRXRCOzs7QUFHTCxBQUFBLElBQUksQ0FBQTtFQUNBLE9BQU8sRUFBRSxJQUFJO0VBQ2IsU0FBUyxFQUFFLEdBQUcsR0FDakI7OztBQUVELEFBQUEsT0FBTyxDQUFBO0VBQ0gsT0FBTyxFQUFFLElBQUk7RUFDYixjQUFjLEVBQUUsTUFBTSxHQUN6Qjs7O0FBRUQsQUFBQSxJQUFJLENBQUM7RUFDRCxVQUFVLEVBQUUsUUFBUTtFQUNwQixXQUFXLEVBQUUsSUFBSSxHQUNwQjs7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 */","@import \"common/variables\";\n\n/** Import theme styles */\n@import \"common/global\";\n@import \"components/buttons\";\n@import \"components/comments\";\n@import \"components/forms\";\n@import \"components/wp-classes\";\n@import \"layouts/header\";\n@import \"layouts/sidebar\";\n@import \"layouts/footer\";\n@import \"layouts/pages\";\n@import \"layouts/posts\";\n","body{\r\n    margin: 0;\r\n}\r\n\r\n*{\r\n    box-sizing: border-box;\r\n}\r\n\r\na {\r\n    text-decoration: none;\r\n    color: #09c;\r\n}\r\n\r\nhtml{\r\n    font-family: 'Lato', sans-serif;\r\n    color: #222;\r\n}\r\n\r\n.flex {\r\n    display: flex;\r\n    &.mobile {\r\n        @media (max-width: $tablet) {\r\n            flex-wrap: wrap;\r\n        }\r\n    }\r\n}\r\n\r\n.row{\r\n    display: flex;\r\n    flex-flow: row;\r\n}\r\n\r\n.column{\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n.end {\r\n    align-self: flex-end;\r\n    margin-left: auto;\r\n}\r\n\r\n.flex-align{\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.center{\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.text-center{\r\n    text-align: center;\r\n}\r\n\r\n.inner-content{\r\n    width: 100%;\r\n    max-width: $desktop;\r\n    display: flex;\r\n    margin: auto;\r\n}\r\n\r\n.flex-left{\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: flex-start;\r\n}\r\n\r\n.wp-block-file{\r\n    display: flex;\r\n    a{\r\n        font-weight: bold;\r\n    }\r\n}\r\n\r\nhr{\r\n    border: 0;\r\n    border-bottom: 1px solid #ccc;\r\n}\r\n\r\n","@charset \"UTF-8\";\n\n/** Import theme styles */\n\n/* line 1, resources/assets/styles/common/_global.scss */\n\nbody {\n  margin: 0;\n}\n\n/* line 5, resources/assets/styles/common/_global.scss */\n\n* {\n  box-sizing: border-box;\n}\n\n/* line 9, resources/assets/styles/common/_global.scss */\n\na {\n  text-decoration: none;\n  color: #09c;\n}\n\n/* line 14, resources/assets/styles/common/_global.scss */\n\nhtml {\n  font-family: 'Lato', sans-serif;\n  color: #222;\n}\n\n/* line 19, resources/assets/styles/common/_global.scss */\n\n.flex {\n  display: flex;\n}\n\n@media (max-width: 800px) {\n  /* line 21, resources/assets/styles/common/_global.scss */\n\n  .flex.mobile {\n    flex-wrap: wrap;\n  }\n}\n\n/* line 28, resources/assets/styles/common/_global.scss */\n\n.row {\n  display: flex;\n  flex-flow: row;\n}\n\n/* line 33, resources/assets/styles/common/_global.scss */\n\n.column {\n  display: flex;\n  flex-direction: column;\n}\n\n/* line 38, resources/assets/styles/common/_global.scss */\n\n.end {\n  align-self: flex-end;\n  margin-left: auto;\n}\n\n/* line 43, resources/assets/styles/common/_global.scss */\n\n.flex-align {\n  display: flex;\n  align-items: center;\n}\n\n/* line 48, resources/assets/styles/common/_global.scss */\n\n.center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* line 54, resources/assets/styles/common/_global.scss */\n\n.text-center {\n  text-align: center;\n}\n\n/* line 58, resources/assets/styles/common/_global.scss */\n\n.inner-content {\n  width: 100%;\n  max-width: 1400px;\n  display: flex;\n  margin: auto;\n}\n\n/* line 65, resources/assets/styles/common/_global.scss */\n\n.flex-left {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n\n/* line 71, resources/assets/styles/common/_global.scss */\n\n.wp-block-file {\n  display: flex;\n}\n\n/* line 73, resources/assets/styles/common/_global.scss */\n\n.wp-block-file a {\n  font-weight: bold;\n}\n\n/* line 78, resources/assets/styles/common/_global.scss */\n\nhr {\n  border: 0;\n  border-bottom: 1px solid #ccc;\n}\n\n/* line 1, resources/assets/styles/components/_buttons.scss */\n\n.button {\n  background: #990000;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  margin: 5px;\n}\n\n/* line 12, resources/assets/styles/components/_buttons.scss */\n\n.button.secondary {\n  background: #164472;\n}\n\n/* line 15, resources/assets/styles/components/_buttons.scss */\n\n.button.search {\n  padding: 5px;\n}\n\n/* line 19, resources/assets/styles/components/_buttons.scss */\n\n.button.featured {\n  margin: 15px 0;\n  padding: 10px 20px;\n  font-size: 1.4em;\n}\n\n/* line 24, resources/assets/styles/components/_buttons.scss */\n\n.button.bright {\n  background: #b81414;\n}\n\n/* line 27, resources/assets/styles/components/_buttons.scss */\n\n.button.box-shadow {\n  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5);\n}\n\n/* line 30, resources/assets/styles/components/_buttons.scss */\n\n.button.flat {\n  background: none;\n  color: #c00;\n}\n\n/* line 33, resources/assets/styles/components/_buttons.scss */\n\n.button.flat.secondary {\n  color: #164472;\n}\n\n/* line 37, resources/assets/styles/components/_buttons.scss */\n\n.button.small-button-text {\n  font-size: 1.1em;\n}\n\n/* line 1, resources/assets/styles/components/_forms.scss */\n\ninput,\ntextarea {\n  padding: 10px;\n  border-radius: 4px;\n  border: 0;\n  border: 1px solid #ccc;\n  margin-top: 5px;\n  margin-bottom: 5px;\n  width: 100%;\n  max-width: 400px;\n  font-size: 1em;\n}\n\n/* line 13, resources/assets/styles/components/_forms.scss */\n\ninput[type=\"submit\"] {\n  background: #164472;\n  color: white;\n  border: 0;\n  cursor: pointer;\n  padding: 8px 14px;\n  display: inline-flex;\n  font-size: 1.2em;\n  font-weight: 600;\n  border-radius: 4px;\n  text-align: center;\n  width: auto;\n}\n\n/* line 27, resources/assets/styles/components/_forms.scss */\n\nform {\n  display: flex;\n  justify-content: center;\n}\n\n/* line 2, resources/assets/styles/layouts/_header.scss */\n\nheader .header-container {\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n}\n\n/* line 7, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon {\n  display: none;\n}\n\n/* line 9, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon i {\n  font-size: 1.5em;\n  vertical-align: sub;\n}\n\n/* line 13, resources/assets/styles/layouts/_header.scss */\n\n.menu-icon a {\n  color: white;\n  padding: 11.5px;\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n@media (max-width: 1000px) {\n  /* line 7, resources/assets/styles/layouts/_header.scss */\n\n  .menu-icon {\n    display: flex;\n  }\n}\n\n/* line 26, resources/assets/styles/layouts/_header.scss */\n\n.main-header {\n  background: #A80D0D;\n}\n\n/* line 28, resources/assets/styles/layouts/_header.scss */\n\n.main-header .brand {\n  font-size: 2.3em;\n  font-weight: bold;\n  display: flex;\n  align-items: center;\n  padding: 4px 10px;\n}\n\n/* line 34, resources/assets/styles/layouts/_header.scss */\n\n.main-header .brand img {\n  max-height: 60px;\n}\n\n@media (max-width: 600px) {\n  /* line 28, resources/assets/styles/layouts/_header.scss */\n\n  .main-header .brand {\n    font-size: 1.5em;\n  }\n}\n\n/* line 41, resources/assets/styles/layouts/_header.scss */\n\n.main-header a {\n  color: white;\n}\n\n/* line 46, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav {\n  background: #7E0707;\n}\n\n@media (max-width: 1000px) {\n  /* line 48, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav #menu-primary {\n    z-index: 9;\n    position: absolute;\n    display: none;\n    top: 47px;\n    min-width: 250px;\n    right: 0px;\n    background: #5e0505;\n    flex-direction: column;\n  }\n}\n\n/* line 60, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav ul {\n  list-style: none;\n  margin: 0;\n  display: flex;\n  padding-left: 0;\n}\n\n/* line 65, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav ul a {\n  color: white;\n  text-decoration: none;\n  font-size: 1.2em;\n  padding: 12px 25px;\n  display: block;\n}\n\n@media (max-width: 1000px) {\n  /* line 73, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul a {\n    padding: 14px 45px;\n    border-bottom: 1px solid #410404;\n  }\n\n  /* line 78, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul.menu-item-has-children > a {\n    background: #711414;\n  }\n\n  /* line 82, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav ul.menu-item-has-children .sub-menu a {\n    padding-left: 10px;\n  }\n}\n\n/* line 89, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav .sub-menu {\n  display: none;\n  position: absolute;\n  background: #660606;\n  flex-direction: column;\n}\n\n@media (max-width: 1000px) {\n  /* line 89, resources/assets/styles/layouts/_header.scss */\n\n  .primary-nav .sub-menu {\n    display: flex;\n    position: relative;\n  }\n}\n\n/* line 99, resources/assets/styles/layouts/_header.scss */\n\n.primary-nav .menu-item-has-children > a:after {\n  color: #fff;\n  content: '▾';\n}\n\n/* line 105, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav {\n  background: #0B253B;\n}\n\n/* line 107, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav .menu-secondary-nav-container {\n  width: 100%;\n}\n\n/* line 110, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul {\n  list-style: none;\n  margin: 0;\n  display: flex;\n  padding-left: 0;\n  flex: 1 0 auto;\n}\n\n/* line 116, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul li {\n  flex: 1 0 auto;\n}\n\n/* line 119, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul a {\n  display: flex;\n  text-align: center;\n  color: white;\n  text-decoration: none;\n  font-size: 1.2em;\n  padding: 12px 25px;\n  display: block;\n  border-left: 1px solid rgba(255, 255, 255, 0.2);\n}\n\n@media (max-width: 800px) {\n  /* line 119, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul a {\n    border: 0;\n  }\n}\n\n/* line 133, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav ul li:last-child a {\n  border-right: 1px solid rgba(255, 255, 255, 0.2);\n}\n\n@media (max-width: 1400px) {\n  /* line 133, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:last-child a {\n    border-right: 0;\n  }\n}\n\n@media (max-width: 800px) {\n  /* line 133, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:last-child a {\n    border: 0;\n  }\n}\n\n@media (max-width: 1400px) {\n  /* line 144, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:first-child a {\n    border-left: 0;\n  }\n}\n\n@media (max-width: 800px) {\n  /* line 144, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav ul li:first-child a {\n    border: 0;\n  }\n}\n\n/* line 155, resources/assets/styles/layouts/_header.scss */\n\n.secondary-nav .secondary-nav-drop {\n  display: none;\n}\n\n@media (max-width: 800px) {\n  /* line 159, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .menu-secondary-nav-container {\n    position: absolute;\n    z-index: 8;\n  }\n\n  /* line 162, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .menu-secondary-nav-container ul {\n    display: none;\n    flex-direction: column;\n    background: #071825;\n  }\n\n  /* line 168, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .secondary-nav-drop {\n    display: flex;\n    flex: 1 0 auto;\n    justify-content: center;\n    padding: 3.5px;\n    color: white;\n  }\n\n  /* line 173, resources/assets/styles/layouts/_header.scss */\n\n  .secondary-nav .secondary-nav-drop i {\n    font-size: 2.5em;\n  }\n}\n\n/* line 181, resources/assets/styles/layouts/_header.scss */\n\n.inner-menu {\n  width: 100%;\n  max-width: 1400px;\n  display: flex;\n  margin: auto;\n  padding: 0 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 181, resources/assets/styles/layouts/_header.scss */\n\n  .inner-menu {\n    padding: 0;\n  }\n}\n\n/* line 192, resources/assets/styles/layouts/_header.scss */\n\n.search-panel {\n  display: none;\n}\n\n/* line 196, resources/assets/styles/layouts/_header.scss */\n\n.chinese-text {\n  font-size: 1.3em;\n  color: white;\n  padding: 4px 10px;\n  display: flex;\n  align-items: center;\n}\n\n/* line 204, resources/assets/styles/layouts/_header.scss */\n\n.menu-primary-container {\n  position: relative;\n}\n\n/* line 1, resources/assets/styles/layouts/_footer.scss */\n\n.footer-header {\n  font-size: 2em;\n}\n\n/* line 5, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer {\n  background: #722;\n  padding: 20px;\n  color: white;\n}\n\n/* line 9, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer .brand {\n  font-size: 2em;\n  font-weight: bold;\n  display: flex;\n  align-items: center;\n}\n\n/* line 14, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer .brand img {\n  padding: 2px;\n  max-height: 50px;\n}\n\n/* line 19, resources/assets/styles/layouts/_footer.scss */\n\n.final-footer a {\n  color: white;\n}\n\n/* line 24, resources/assets/styles/layouts/_footer.scss */\n\n.grey-footer {\n  background: #ddd;\n  padding: 40px;\n  color: #222;\n}\n\n@media (max-width: 800px) {\n  /* line 24, resources/assets/styles/layouts/_footer.scss */\n\n  .grey-footer {\n    padding: 40px 20px;\n  }\n}\n\n/* line 33, resources/assets/styles/layouts/_footer.scss */\n\n.seperators {\n  padding: 10px;\n  display: flex;\n}\n\n/* line 36, resources/assets/styles/layouts/_footer.scss */\n\n.seperators > div {\n  flex: 1 0 0;\n  padding: 30px;\n  border-left: 1px solid #bbb;\n}\n\n/* line 40, resources/assets/styles/layouts/_footer.scss */\n\n.seperators > div:first-child {\n  border-left: none;\n}\n\n@media (max-width: 800px) {\n  /* line 33, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators {\n    flex-direction: column;\n  }\n\n  /* line 46, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators > div {\n    border: 0;\n    width: 100%;\n    padding: 20px;\n    border-bottom: 1px solid #bbb;\n  }\n\n  /* line 51, resources/assets/styles/layouts/_footer.scss */\n\n  .seperators > div:last-child {\n    border-top: none;\n  }\n}\n\n/* line 58, resources/assets/styles/layouts/_footer.scss */\n\n.stats-title {\n  font-size: 1.8em;\n  font-weight: 600;\n  margin: 0;\n}\n\n/* line 64, resources/assets/styles/layouts/_footer.scss */\n\n.big-number {\n  font-size: 3em;\n  font-weight: 1000;\n  color: #09c;\n}\n\n/* line 70, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box {\n  flex: 1 0 0;\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  margin: 10px;\n}\n\n/* line 76, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-title {\n  font-size: 1.5em;\n  display: flex;\n  justify-content: center;\n  background: #0a1e32;\n  padding: 6px;\n}\n\n/* line 83, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container {\n  color: #222;\n  padding: 5px;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  flex: 1 0 auto;\n}\n\n/* line 92, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container img {\n  padding: 10px;\n  max-height: 100px;\n  height: 100%;\n}\n\n/* line 100, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item {\n  padding: 5px;\n  display: flex;\n  align-items: center;\n}\n\n/* line 104, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item .wrapping {\n  padding: 6px;\n  color: #25b;\n  background: white;\n  border-radius: 100px;\n  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n}\n\n/* line 111, resources/assets/styles/layouts/_footer.scss */\n\n.contact-item .contact-text {\n  color: #222;\n  padding-left: 10px;\n  font-size: 1.3em;\n  font-weight: bold;\n  text-align: left;\n}\n\n/* line 120, resources/assets/styles/layouts/_footer.scss */\n\n.sponsor-box .sponsor-container .large-image {\n  max-height: 120px;\n}\n\n/* line 1, resources/assets/styles/layouts/_pages.scss */\n\nhtml {\n  background: #f6f6f6;\n}\n\n/* line 5, resources/assets/styles/layouts/_pages.scss */\n\n.hero {\n  background: transparent;\n}\n\n/* line 7, resources/assets/styles/layouts/_pages.scss */\n\n.hero.dark {\n  background: #222;\n  color: white;\n}\n\n/* line 11, resources/assets/styles/layouts/_pages.scss */\n\n.hero.image {\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n\n/* line 18, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero {\n  margin: auto;\n  max-width: 1400px;\n  width: 100%;\n}\n\n/* line 22, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.image {\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n}\n\n/* line 30, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page {\n  padding: 40px;\n  background: white;\n  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);\n  font-size: 1.2em;\n}\n\n@media (max-width: 800px) {\n  /* line 30, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.page {\n    padding: 20px;\n  }\n}\n\n/* line 38, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page.max {\n  margin: 0;\n  max-width: none;\n}\n\n/* line 43, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.page-text {\n  font-size: 1.2em;\n}\n\n/* line 46, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-none {\n  padding: 10px 30px;\n}\n\n@media (max-width: 800px) {\n  /* line 46, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-none {\n    padding: 10px;\n  }\n}\n\n/* line 52, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-tiny {\n  padding: 20px 30px;\n}\n\n@media (max-width: 800px) {\n  /* line 52, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-tiny {\n    padding: 20px;\n  }\n}\n\n/* line 58, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-small {\n  padding: 5vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 58, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-small {\n    padding: 5vh 10px;\n  }\n}\n\n/* line 64, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-medium {\n  padding: 10vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 64, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-medium {\n    padding: 10vh 10px;\n  }\n}\n\n/* line 70, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-medium-large {\n  padding: 16vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 70, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-medium-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 76, resources/assets/styles/layouts/_pages.scss */\n\n.hero .inner-hero.padding-large {\n  padding: 25vh 10px;\n}\n\n@media (max-width: 800px) {\n  /* line 76, resources/assets/styles/layouts/_pages.scss */\n\n  .hero .inner-hero.padding-large {\n    padding: 16vh 40px;\n  }\n}\n\n/* line 83, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-none {\n  padding: 10px 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 83, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-none {\n    padding: 10px;\n  }\n}\n\n/* line 89, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-tiny {\n  padding: 20px 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 89, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-tiny {\n    padding: 20px;\n  }\n}\n\n/* line 95, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-small {\n  padding: 5vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 95, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-small {\n    padding: 5vh 10px;\n  }\n}\n\n/* line 101, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-medium {\n  padding: 10vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 101, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-medium {\n    padding: 10vh 10px;\n  }\n}\n\n/* line 107, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-medium-large {\n  padding: 16vh 50px;\n}\n\n@media (max-width: 800px) {\n  /* line 107, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-medium-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 113, resources/assets/styles/layouts/_pages.scss */\n\n.hero.padding-large {\n  padding: 25vh 40px;\n}\n\n@media (max-width: 800px) {\n  /* line 113, resources/assets/styles/layouts/_pages.scss */\n\n  .hero.padding-large {\n    padding: 16vh 10px;\n  }\n}\n\n/* line 121, resources/assets/styles/layouts/_pages.scss */\n\n.title {\n  font-size: 3em;\n}\n\n/* line 125, resources/assets/styles/layouts/_pages.scss */\n\n.shadow {\n  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.2);\n}\n\n/* line 129, resources/assets/styles/layouts/_pages.scss */\n\n.featured-text {\n  font-size: 1.5em;\n  max-width: 800px;\n}\n\n/* line 134, resources/assets/styles/layouts/_pages.scss */\n\n.front-page-h2 {\n  font-size: 2.2em;\n  margin: 0;\n  margin-bottom: 30px;\n  font-weight: bold;\n  color: #a11;\n}\n\n/* line 1, resources/assets/styles/layouts/_posts.scss */\n\n.event-box {\n  background: white;\n  margin: 10px;\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);\n  border-radius: 5px;\n  flex: 1 0 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n}\n\n/* line 10, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .event-background {\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  padding: 70px 10px;\n  background: #333;\n  color: white;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n  font-size: 1.4em;\n  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.6);\n}\n\n/* line 26, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .buttons-event {\n  margin-top: auto;\n  display: flex;\n  justify-content: center;\n  padding: 10px 0;\n}\n\n/* line 32, resources/assets/styles/layouts/_posts.scss */\n\n.event-box .excerpt {\n  padding: 15px;\n}\n\n/* line 37, resources/assets/styles/layouts/_posts.scss */\n\n.events-container {\n  display: flex;\n  width: 100%;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n\n/* line 44, resources/assets/styles/layouts/_posts.scss */\n\n.time {\n  display: flex;\n}\n\n/* line 46, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-length {\n  padding-left: 20px;\n  padding-right: 20px;\n  text-align: center;\n}\n\n@media (max-width: 600px) {\n  /* line 46, resources/assets/styles/layouts/_posts.scss */\n\n  .time .time-length {\n    padding-left: 10px;\n    padding-right: 10px;\n  }\n}\n\n/* line 55, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-date {\n  font-size: 4em;\n}\n\n/* line 58, resources/assets/styles/layouts/_posts.scss */\n\n.time .time-text {\n  font-size: 2em;\n}\n\n@media (max-width: 600px) {\n  /* line 58, resources/assets/styles/layouts/_posts.scss */\n\n  .time .time-text {\n    font-size: 1.5em;\n  }\n}\n\n/* line 66, resources/assets/styles/layouts/_posts.scss */\n\n.card {\n  background: white;\n  padding: 20px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);\n  border-radius: 4px;\n}\n\n",".button{\r\n    background: darken($maintheme, 10%);\r\n    color: white;\r\n    border: 0;\r\n    cursor: pointer;\r\n    padding: 8px 14px;\r\n    display: inline-flex;\r\n    font-size: 1.2em;\r\n    font-weight: 600;\r\n    border-radius: 4px;\r\n    margin: 5px;\r\n    &.secondary{\r\n        background: $secondarytheme;\r\n    }\r\n    &.search{\r\n        padding: 5px;\r\n    }\r\n\r\n    &.featured{\r\n        margin: 15px 0;\r\n        padding: 10px 20px;\r\n        font-size: 1.4em;\r\n    }\r\n    &.bright{\r\n        background: desaturate($maintheme, 20%);\r\n    }\r\n    &.box-shadow{\r\n        box-shadow: 0 0 8px 2px rgba(0,0,0,0.5);\r\n    }\r\n    &.flat{\r\n        background: none;\r\n        color: $maintheme;\r\n        &.secondary {\r\n            color: $secondarytheme\r\n        }\r\n    }\r\n    &.small-button-text{\r\n        font-size: 1.1em;\r\n    }\r\n}","input, textarea{\r\n    padding: 10px;\r\n    border-radius: 4px;\r\n    border: 0;\r\n    border: 1px solid #ccc;\r\n    margin-top: 5px;\r\n    margin-bottom: 5px;\r\n    width: 100%;\r\n    max-width: 400px;\r\n    font-size: 1em;\r\n}\r\n\r\ninput[type=\"submit\"]{\r\n    background: $secondarytheme;\r\n    color: white;\r\n    border: 0;\r\n    cursor: pointer;\r\n    padding: 8px 14px;\r\n    display: inline-flex;\r\n    font-size: 1.2em;\r\n    font-weight: 600;\r\n    border-radius: 4px;\r\n    text-align: center;\r\n    width: auto;\r\n}\r\n\r\nform{\r\n    display: flex;\r\n    justify-content: center;\r\n}","header {\n  .header-container {\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n  }\n}\n\n.menu-icon{\n  display: none;\n  i{\n    font-size: 1.5em;\n    vertical-align: sub;\n  }\n  a{\n    color: white;\n    padding: 11.5px;\n    display: flex;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n  }\n  @media (max-width: $laptop) {\n    display: flex;\n  }\n}\n\n.main-header{\n  background: #A80D0D;\n  .brand{\n    font-size: 2.3em;\n    font-weight: bold;\n    display: flex;\n    align-items: center;\n    padding: 4px 10px;\n    img{\n      max-height: 60px;\n    }\n    @media (max-width: $phone) {\n      font-size: 1.5em;\n    }\n  }\n  a{\n    color: white;\n  }\n}\n\n.primary-nav {\n  background: #7E0707;\n  #menu-primary {\n    @media (max-width: $laptop) {\n      z-index: 9;\n      position: absolute;\n      display: none;\n      top: 47px;\n      min-width: 250px;\n      right: 0px;\n      background: rgb(94, 5, 5);\n      flex-direction: column;\n    }\n  }\n  ul{\n    list-style: none;\n    margin: 0;\n    display: flex;\n    padding-left: 0;\n    a {\n      color: white;\n      text-decoration: none;\n      font-size: 1.2em;\n      padding: 12px 25px;\n      display: block;\n    }\n    @media (max-width: $laptop) {\n      a{\n        padding: 14px 45px;\n        border-bottom: 1px solid rgb(65, 4, 4);\n      }\n      &.menu-item-has-children{\n        > a{\n          background: desaturate(#7E0707, 20%)\n        }\n        .sub-menu{\n          a{\n            padding-left: 10px;\n          }\n        }\n      }\n    }\n  }\n  .sub-menu{\n    display: none;\n    position: absolute;\n    background: darken(#7E0707, 5%);\n    flex-direction: column;\n    @media (max-width: $laptop) {\n      display: flex;\n      position: relative;\n    }\n  }\n  .menu-item-has-children > a:after {\n    color: #fff;\n    content: 'â¾';\n  }\n}\n\n.secondary-nav {\n  background:#0B253B;\n  .menu-secondary-nav-container{\n    width: 100%;\n  }\n  ul{\n    list-style: none;\n    margin: 0;\n    display: flex;\n    padding-left: 0;\n    flex: 1 0 auto;\n    li{\n      flex: 1 0 auto;\n    }\n    a {\n      display: flex;\n      text-align: center;\n      color: white;\n      text-decoration: none;\n      font-size: 1.2em;\n      padding: 12px 25px;\n      display: block;\n      border-left: 1px solid rgba(255,255,255,0.2);\n      @media (max-width: $tablet) {\n        border: 0;\n      }\n    }\n    li:last-child {\n      a {\n        border-right: 1px solid rgba(255,255,255,0.2);\n        @media (max-width: $desktop) {\n          border-right: 0;\n        }\n        @media (max-width: $tablet) {\n          border: 0;\n        }\n      }\n    }\n    li:first-child {\n      a{\n        \n        @media (max-width: $desktop) {\n          border-left: 0;\n        }\n        @media (max-width: $tablet) {\n          border: 0;\n        }\n      }\n    }\n  }\n  .secondary-nav-drop{\n    display: none;\n  }\n  @media (max-width: $tablet) {\n    .menu-secondary-nav-container{\n      position: absolute;\n      z-index: 8;\n      ul{\n        display: none;\n        flex-direction: column;\n        background: rgb(7, 24, 37);\n      }\n    }\n    .secondary-nav-drop{\n      display: flex;\n      flex: 1 0 auto;\n      justify-content: center;\n      padding: 3.5px;\n      i{\n        font-size: 2.5em;\n      }\n      color: white;\n    }\n  }\n}\n\n.inner-menu{\n  width: 100%;\n  max-width: $desktop;\n  display: flex;\n  margin: auto;\n  padding: 0 40px;\n  @media (max-width: $tablet) {\n    padding: 0\n  }\n}\n\n.search-panel{\n  display: none;\n}\n\n.chinese-text{\n  font-size: 1.3em;\n  color: white;\n  padding: 4px 10px;\n  display: flex;\n  align-items: center;\n}\n\n.menu-primary-container {\n  position: relative;\n}",".footer-header{\r\n    font-size: 2em;\r\n}\r\n\r\n.final-footer{\r\n    background: #722;\r\n    padding: 20px;\r\n    color: white;\r\n    .brand{\r\n        font-size: 2em;\r\n        font-weight: bold;\r\n        display: flex;\r\n        align-items: center;\r\n        img{\r\n            padding: 2px;\r\n            max-height: 50px;\r\n        }\r\n    }\r\n    a{\r\n        color: white;\r\n    }\r\n}\r\n\r\n.grey-footer{\r\n    background: #ddd;\r\n    padding: 40px;\r\n    color: #222;\r\n    @media (max-width: $tablet) {\r\n        padding: 40px 20px;\r\n    }\r\n}\r\n\r\n.seperators{\r\n    padding: 10px;\r\n    display: flex;\r\n    > div {\r\n        flex: 1 0 0;\r\n        padding: 30px;\r\n        border-left: 1px solid #bbb;\r\n        &:first-child{\r\n            border-left: none\r\n        }\r\n    }\r\n    @media (max-width: $tablet) {\r\n        flex-direction: column;\r\n        > div{\r\n            border: 0;\r\n            width: 100%;\r\n            padding: 20px;\r\n            border-bottom: 1px solid #bbb;\r\n            &:last-child {\r\n                border-top: none; \r\n            }\r\n        }\r\n    }\r\n}\r\n\r\n.stats-title{\r\n    font-size: 1.8em;\r\n    font-weight: 600;\r\n    margin: 0;\r\n}\r\n\r\n.big-number{\r\n    font-size: 3em;\r\n    font-weight: 1000;\r\n    color: #09c\r\n}\r\n\r\n.sponsor-box{\r\n    flex: 1 0 0;\r\n    background: #fff;\r\n    display: flex;\r\n    flex-direction: column;\r\n    margin: 10px;\r\n    .sponsor-title{\r\n        font-size: 1.5em;\r\n        display: flex;\r\n        justify-content: center;\r\n        background: darken($secondarytheme, 15%);\r\n        padding: 6px;\r\n    }\r\n    .sponsor-container{\r\n        color: #222;\r\n        padding: 5px;\r\n        display: flex;\r\n        flex-direction: row;\r\n        flex-wrap: wrap;\r\n        align-items: center;\r\n        justify-content: center;\r\n        flex: 1 0 auto;\r\n        img{\r\n            padding: 10px;\r\n            max-height: 100px;\r\n            height: 100%;\r\n        }\r\n    }\r\n}\r\n\r\n.contact-item{\r\n    padding: 5px;\r\n    display: flex;\r\n    align-items: center;\r\n    .wrapping{\r\n        padding: 6px;\r\n        color: #25b;\r\n        background: white;\r\n        border-radius: 100px;\r\n        box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);\r\n    }\r\n    .contact-text{\r\n        color: #222;\r\n        padding-left: 10px;\r\n        font-size: 1.3em;\r\n        font-weight: bold;\r\n        text-align: left;\r\n    }\r\n}\r\n\r\n.sponsor-box  .sponsor-container .large-image{\r\n    max-height: 120px;\r\n}","html{\r\n    background: #f6f6f6;\r\n}\r\n\r\n.hero{\r\n    background: transparent;\r\n    &.dark{\r\n        background: #222;\r\n        color: white;\r\n    }\r\n    &.image{\r\n        background: #333;\r\n        color: white;\r\n        background-position: center;\r\n        background-repeat: no-repeat;\r\n        background-size: cover;\r\n    }\r\n    .inner-hero{\r\n        margin: auto;\r\n        max-width: $desktop;\r\n        width: 100%;\r\n        &.image{\r\n            background: #333;\r\n            color: white;\r\n            background-position: center;\r\n            background-repeat: no-repeat;\r\n            background-size: cover;\r\n            box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);\r\n        }\r\n        &.page{\r\n            padding: 40px;\r\n            background: white;\r\n            box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);\r\n            font-size: 1.2em;\r\n            @media (max-width: $tablet) {\r\n                padding: 20px;\r\n            }\r\n            &.max{\r\n                margin: 0;\r\n                max-width: none;\r\n            }\r\n        }\r\n        &.page-text{\r\n            font-size: 1.2em;\r\n        }\r\n        &.padding-none{\r\n            padding: 10px 30px;\r\n            @media (max-width: $tablet) {\r\n                padding: 10px;\r\n            }\r\n        }\r\n        &.padding-tiny{\r\n            padding: 20px 30px;\r\n            @media (max-width: $tablet) {\r\n                padding: 20px;\r\n            }\r\n        }\r\n        &.padding-small{\r\n            padding: 5vh 40px;\r\n            @media (max-width: $tablet) {\r\n                padding: 5vh 10px;\r\n            }\r\n        }\r\n        &.padding-medium{\r\n            padding: 10vh 40px;\r\n            @media (max-width: $tablet) {\r\n                padding: 10vh 10px;\r\n            }\r\n        }\r\n        &.padding-medium-large{\r\n            padding: 16vh 40px;\r\n            @media (max-width: $tablet) {\r\n                padding: 16vh 10px;\r\n            }\r\n        }\r\n        &.padding-large{\r\n            padding: 25vh 10px;\r\n            @media (max-width: $tablet) {\r\n                padding: 16vh 40px;\r\n            }\r\n        }\r\n    }\r\n    &.padding-none{\r\n        padding: 10px 40px;\r\n        @media (max-width: $tablet) {\r\n            padding: 10px;\r\n        }\r\n    }\r\n    &.padding-tiny{\r\n        padding: 20px 40px;\r\n        @media (max-width: $tablet) {\r\n            padding: 20px;\r\n        }\r\n    }\r\n    &.padding-small{\r\n        padding: 5vh 50px;\r\n        @media (max-width: $tablet) {\r\n            padding: 5vh 10px;\r\n        }\r\n    }\r\n    &.padding-medium{\r\n        padding: 10vh 50px;\r\n        @media (max-width: $tablet) {\r\n            padding: 10vh 10px;\r\n        }\r\n    }\r\n    &.padding-medium-large{\r\n        padding: 16vh 50px;\r\n        @media (max-width: $tablet) {\r\n            padding: 16vh 10px;\r\n        }\r\n    }\r\n    &.padding-large{\r\n        padding: 25vh 40px;\r\n        @media (max-width: $tablet) {\r\n            padding: 16vh 10px;\r\n        }\r\n    }\r\n}\r\n\r\n.title{\r\n    font-size: 3em;\r\n}\r\n\r\n.shadow{\r\n    text-shadow: 0 0 6px rgba(0,0,0,0.4), 0 0 2px rgba(0,0,0,0.2);\r\n}\r\n\r\n.featured-text{\r\n    font-size: 1.5em;\r\n    max-width: 800px;\r\n}\r\n\r\n.front-page-h2{\r\n    font-size: 2.2em;\r\n    margin: 0;\r\n    margin-bottom: 30px;\r\n    font-weight: bold;\r\n    color: #a11;\r\n}\r\n\r\n",".event-box {\r\n    background: white;\r\n    margin: 10px;\r\n    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.3);\r\n    border-radius: 5px;\r\n    flex: 1 0 100%;\r\n    max-width: 400px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    .event-background{\r\n        border-top-left-radius: 5px;\r\n        border-top-right-radius: 5px;\r\n        padding: 70px 10px;\r\n        background: #333;\r\n        color: white;\r\n        background-position: center;\r\n        background-repeat: no-repeat;\r\n        background-size: cover;\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        font-weight: 600;\r\n        font-size: 1.4em;\r\n        text-shadow: 0 0 2px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6);\r\n    }\r\n    .buttons-event{\r\n        margin-top: auto;\r\n        display: flex;\r\n        justify-content: center;\r\n        padding: 10px 0;\r\n    }\r\n    .excerpt{\r\n        padding: 15px;\r\n    }\r\n}\r\n\r\n.events-container{\r\n    display: flex;\r\n    width: 100%;\r\n    justify-content: center;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.time{\r\n    display: flex;\r\n    .time-length{\r\n        padding-left: 20px;\r\n        padding-right: 20px;\r\n        text-align: center;\r\n        @media (max-width: $phone) {\r\n            padding-left: 10px;\r\n            padding-right: 10px;\r\n        }\r\n    }\r\n    .time-date{\r\n        font-size: 4em;\r\n    }\r\n    .time-text{\r\n        font-size: 2em;\r\n        @media (max-width: $phone) {\r\n            font-size: 1.5em;\r\n        }\r\n    }\r\n}\r\n\r\n.card {\r\n    background: white;\r\n    padding: 20px;\r\n    box-shadow: 0 0 6px 0 rgba(0,0,0,0.2);\r\n    border-radius: 4px;\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 17 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\xampp\apps\wordpress\htdocs\wp-content\themes\acma-theme\resources\assets\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */18);
module.exports = __webpack_require__(/*! ./styles/main.scss */28);


/***/ }),
/* 18 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(/*! jquery */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_bootstrap_js__ = __webpack_require__(/*! ./autoload/_bootstrap.js */ 19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_Router__ = __webpack_require__(/*! ./util/Router */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_common__ = __webpack_require__(/*! ./routes/common */ 25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes_home__ = __webpack_require__(/*! ./routes/home */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routes_about__ = __webpack_require__(/*! ./routes/about */ 27);
// import external dependencies


// Import everything from autoload


// import local dependencies





/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_2__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_3__routes_common__["a" /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_4__routes_home__["a" /* default */],
  // About Us page, note the change from about-us to aboutUs.
  aboutUs: __WEBPACK_IMPORTED_MODULE_5__routes_about__["a" /* default */],
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 1)))

/***/ }),
/* 19 */
/*!****************************************!*\
  !*** ./scripts/autoload/_bootstrap.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap__ = __webpack_require__(/*! bootstrap */ 20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bootstrap__);



/***/ }),
/* 20 */
/*!***************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/bootstrap/dist/js/bootstrap.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
   true ? factory(exports, __webpack_require__(/*! jquery */ 1), __webpack_require__(/*! popper.js */ 21)) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
  (global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
}(this, function (exports, $, Popper) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) { descriptor.writable = true; }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) { _defineProperties(Constructor.prototype, protoProps); }
    if (staticProps) { _defineProperties(Constructor, staticProps); }
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments$1[i] != null ? arguments$1[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.3.1';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    } // Static
    ;

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$1 = 'button';
  var VERSION$1 = '4.3.1';
  var DATA_KEY$1 = 'bs.button';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var DATA_API_KEY$1 = '.data-api';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var ClassName$1 = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector$1 = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input:not([type="hidden"])',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event$1 = {
    CLICK_DATA_API: "click" + EVENT_KEY$1 + DATA_API_KEY$1,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY$1 + DATA_API_KEY$1 + " " + ("blur" + EVENT_KEY$1 + DATA_API_KEY$1)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = this._element.querySelector(Selector$1.INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName$1.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    } // Static
    ;

    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName$1.BUTTON)) {
      button = $(button).closest(Selector$1.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector$1.BUTTON)[0];
    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button._jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Button._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$2 = 'carousel';
  var VERSION$2 = '4.3.1';
  var DATA_KEY$2 = 'bs.carousel';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var DATA_API_KEY$2 = '.data-api';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPE_THRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event$2 = {
    SLIDE: "slide" + EVENT_KEY$2,
    SLID: "slid" + EVENT_KEY$2,
    KEYDOWN: "keydown" + EVENT_KEY$2,
    MOUSEENTER: "mouseenter" + EVENT_KEY$2,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$2,
    TOUCHSTART: "touchstart" + EVENT_KEY$2,
    TOUCHMOVE: "touchmove" + EVENT_KEY$2,
    TOUCHEND: "touchend" + EVENT_KEY$2,
    POINTERDOWN: "pointerdown" + EVENT_KEY$2,
    POINTERUP: "pointerup" + EVENT_KEY$2,
    DRAG_START: "dragstart" + EVENT_KEY$2,
    LOAD_DATA_API: "load" + EVENT_KEY$2 + DATA_API_KEY$2,
    CLICK_DATA_API: "click" + EVENT_KEY$2 + DATA_API_KEY$2
  };
  var ClassName$2 = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item',
    POINTER_EVENT: 'pointer-event'
  };
  var Selector$2 = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    ITEM_IMG: '.carousel-item img',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(Selector$2.INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(Selector$2.NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event$2.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event$2.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event$2.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
      }

      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      var _this3 = this;

      if (!this._touchSupported) {
        return;
      }

      var start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.originalEvent.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout(function (event) {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      $(this._element.querySelectorAll(Selector$2.ITEM_IMG)).on(Event$2.DRAG_START, function (e) {
        return e.preventDefault();
      });

      if (this._pointerEvent) {
        $(this._element).on(Event$2.POINTERDOWN, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.POINTERUP, function (event) {
          return end(event);
        });

        this._element.classList.add(ClassName$2.POINTER_EVENT);
      } else {
        $(this._element).on(Event$2.TOUCHSTART, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this._element).on(Event$2.TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex(this._element.querySelector(Selector$2.ACTIVE_ITEM));

      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector$2.ACTIVE));
        $(indicators).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this4 = this;

      var activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this._element).hasClass(ClassName$2.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName$2.ACTIVE);
          $(activeElement).removeClass(ClassName$2.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this4._isSliding = false;
          setTimeout(function () {
            return $(_this4._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    } // Static
    ;

    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _config = _objectSpread({}, Default, $(this).data());

        if (typeof config === 'object') {
          _config = _objectSpread({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = _objectSpread({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(Event$2.LOAD_DATA_API, function () {
    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATA_RIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel._jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Carousel._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = 'collapse';
  var VERSION$3 = '4.3.1';
  var DATA_KEY$3 = 'bs.collapse';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = '.data-api';
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event$3 = {
    SHOW: "show" + EVENT_KEY$3,
    SHOWN: "shown" + EVENT_KEY$3,
    HIDE: "hide" + EVENT_KEY$3,
    HIDDEN: "hidden" + EVENT_KEY$3,
    CLICK_DATA_API: "click" + EVENT_KEY$3 + DATA_API_KEY$3
  };
  var ClassName$3 = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector$3 = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      var this$1 = this;

      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATA_TOGGLE));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this$1._selector = selector;

          this$1._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {
          if (typeof _this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === _this._config.parent;
          }

          return elem.classList.contains(ClassName$3.COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event$3.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var this$1 = this;

      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);
      var triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this$1._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(ClassName$3.SHOW);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    } // Static
    ;

    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);

        var _config = _objectSpread({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.3.1';
  var DATA_KEY$4 = 'bs.dropdown';
  var EVENT_KEY$4 = "." + DATA_KEY$4;
  var DATA_API_KEY$4 = '.data-api';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event$4 = {
    HIDE: "hide" + EVENT_KEY$4,
    HIDDEN: "hidden" + EVENT_KEY$4,
    SHOW: "show" + EVENT_KEY$4,
    SHOWN: "shown" + EVENT_KEY$4,
    CLICK: "click" + EVENT_KEY$4,
    CLICK_DATA_API: "click" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYUP_DATA_API: "keyup" + EVENT_KEY$4 + DATA_API_KEY$4
  };
  var ClassName$4 = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector$4 = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName$4.POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.show = function show() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || $(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.hide = function hide() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || !$(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Private
    ;

    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(Selector$4.MENU);
        }
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element.parentNode);
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getOffset = function _getOffset() {
      var _this2 = this;

      var offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this2._config.offset(data.offsets, _this2._element) || {});
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        } // Disable Popper.js if we have a static display

      };

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATA_TOGGLE));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    } // eslint-disable-next-line complexity
    ;

    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(Selector$4.DATA_TOGGLE);
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLE_ITEMS));

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + " " + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = 'modal';
  var VERSION$5 = '4.3.1';
  var DATA_KEY$5 = 'bs.modal';
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = '.data-api';
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event$5 = {
    HIDE: "hide" + EVENT_KEY$5,
    HIDDEN: "hidden" + EVENT_KEY$5,
    SHOW: "show" + EVENT_KEY$5,
    SHOWN: "shown" + EVENT_KEY$5,
    FOCUSIN: "focusin" + EVENT_KEY$5,
    RESIZE: "resize" + EVENT_KEY$5,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$5,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY$5,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY$5,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY$5,
    CLICK_DATA_API: "click" + EVENT_KEY$5 + DATA_API_KEY$5
  };
  var ClassName$5 = {
    SCROLLABLE: 'modal-dialog-scrollable',
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$5 = {
    DIALOG: '.modal-dialog',
    MODAL_BODY: '.modal-body',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(Selector$5.DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isShown || this._isTransitioning) {
        return;
      }

      if ($(this._element).hasClass(ClassName$5.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      var hideEvent = $.Event(Event$5.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event$5.FOCUSIN);
      $(this._element).removeClass(ClassName$5.SHOW);
      $(this._element).off(Event$5.CLICK_DISMISS);
      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      [window, this._element, this._dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENT_KEY$5);
      });
      /**
       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `Event.CLICK_DATA_API` event that should remain
       */

      $(document).off(Event$5.FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      if ($(this._dialog).hasClass(ClassName$5.SCROLLABLE)) {
        this._dialog.querySelector(Selector$5.MODAL_BODY).scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName$5.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event$5.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event$5.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(ClassName$5.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------
    ;

    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }

      $(document.body).addClass(ClassName$5.OPEN);
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKY_CONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    } // Static
    ;

    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        var _config = _objectSpread({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _objectSpread({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event$5.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event$5.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */

  };
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    var _loop = function _loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var _ret = _loop(i, len);

      if (_ret === "continue") { continue; }
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.3.1';
  var DATA_KEY$6 = 'bs.tooltip';
  var EVENT_KEY$6 = "." + DATA_KEY$6;
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object'
  };
  var AttachmentMap$1 = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event$6 = {
    HIDE: "hide" + EVENT_KEY$6,
    HIDDEN: "hidden" + EVENT_KEY$6,
    SHOW: "show" + EVENT_KEY$6,
    SHOWN: "shown" + EVENT_KEY$6,
    INSERTED: "inserted" + EVENT_KEY$6,
    CLICK: "click" + EVENT_KEY$6,
    FOCUSIN: "focusin" + EVENT_KEY$6,
    FOCUSOUT: "focusout" + EVENT_KEY$6,
    MOUSEENTER: "mouseenter" + EVENT_KEY$6,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$6
  };
  var ClassName$6 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$6 = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$6.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this._getContainer();

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: this._getOffset(),
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$6.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            return _this._handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if ($(this.tip).hasClass(ClassName$6.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if ($(this.tip).hasClass(ClassName$6.FADE)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Protected
    ;

    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(ClassName$6.FADE + " " + ClassName$6.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    } // Private
    ;

    _proto._getOffset = function _getOffset() {
      var _this3 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this3.config.offset(data.offsets, _this3.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this4 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this4.element).on(_this4.constructor.Event.CLICK, _this4.config.selector, function (event) {
            return _this4.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSEENTER : _this4.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSELEAVE : _this4.constructor.Event.FOCUSOUT;
          $(_this4.element).on(eventIn, _this4.config.selector, function (event) {
            return _this4._enter(event);
          }).on(eventOut, _this4.config.selector, function (event) {
            return _this4._leave(event);
          });
        }
      });
      $(this.element).closest('.modal').on('hide.bs.modal', function () {
        if (_this4.element) {
          _this4.hide();
        }
      });

      if (this.config.selector) {
        this.config = _objectSpread({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      var this$1 = this;

      for (var trigger in this$1._activeTrigger) {
        if (this$1._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      var dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(function (dataAttr) {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = _objectSpread({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var this$1 = this;

      var config = {};

      if (this.config) {
        for (var key in this$1.config) {
          if (this$1.constructor.Default[key] !== this$1.config[key]) {
            config[key] = this$1.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      var popperInstance = popperData.instance;
      this.tip = popperInstance.popper;

      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName$6.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    } // Static
    ;

    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$6;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip._jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Tooltip._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$7 = 'popover';
  var VERSION$7 = '4.3.1';
  var DATA_KEY$7 = 'bs.popover';
  var EVENT_KEY$7 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var CLASS_PREFIX$1 = 'bs-popover';
  var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');

  var Default$5 = _objectSpread({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = _objectSpread({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var ClassName$7 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$7 = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event$7 = {
    HIDE: "hide" + EVENT_KEY$7,
    HIDDEN: "hidden" + EVENT_KEY$7,
    SHOW: "show" + EVENT_KEY$7,
    SHOWN: "shown" + EVENT_KEY$7,
    INSERTED: "inserted" + EVENT_KEY$7,
    CLICK: "click" + EVENT_KEY$7,
    FOCUSIN: "focusin" + EVENT_KEY$7,
    FOCUSOUT: "focusout" + EVENT_KEY$7,
    MOUSEENTER: "mouseenter" + EVENT_KEY$7,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$7
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector$7.CONTENT), content);
      $tip.removeClass(ClassName$7.FADE + " " + ClassName$7.SHOW);
    } // Private
    ;

    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    } // Static
    ;

    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$7;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover._jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Popover._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.3.1';
  var DATA_KEY$8 = 'bs.scrollspy';
  var EVENT_KEY$8 = "." + DATA_KEY$8;
  var DATA_API_KEY$6 = '.data-api';
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event$8 = {
    ACTIVATE: "activate" + EVENT_KEY$8,
    SCROLL: "scroll" + EVENT_KEY$8,
    LOAD_DATA_API: "load" + EVENT_KEY$8 + DATA_API_KEY$6
  };
  var ClassName$8 = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector$8 = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector$8.NAV_LINKS + "," + (this._config.target + " " + Selector$8.LIST_ITEMS + ",") + (this._config.target + " " + Selector$8.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(Event$8.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var this$1 = this;

      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      var offsetLength = this._offsets.length;

      for (var i = offsetLength; i--;) {
        var isActiveTarget = this$1._activeTarget !== this$1._targets[i] && scrollTop >= this$1._offsets[i] && (typeof this$1._offsets[i + 1] === 'undefined' || scrollTop < this$1._offsets[i + 1]);

        if (isActiveTarget) {
          this$1._activate(this$1._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + ", " + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_ITEMS).children(Selector$8.NAV_LINKS).addClass(ClassName$8.ACTIVE);
      }

      $(this._scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {
        return node.classList.contains(ClassName$8.ACTIVE);
      }).forEach(function (node) {
        return node.classList.remove(ClassName$8.ACTIVE);
      });
    } // Static
    ;

    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event$8.LOAD_DATA_API, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATA_SPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy._jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return ScrollSpy._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$9 = 'tab';
  var VERSION$9 = '4.3.1';
  var DATA_KEY$9 = 'bs.tab';
  var EVENT_KEY$9 = "." + DATA_KEY$9;
  var DATA_API_KEY$7 = '.data-api';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var Event$9 = {
    HIDE: "hide" + EVENT_KEY$9,
    HIDDEN: "hidden" + EVENT_KEY$9,
    SHOW: "show" + EVENT_KEY$9,
    SHOWN: "shown" + EVENT_KEY$9,
    CLICK_DATA_API: "click" + EVENT_KEY$9 + DATA_API_KEY$7
  };
  var ClassName$9 = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$9 = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    } // Private
    ;

    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVE_UL) : $(container).children(Selector$9.ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName$9.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(ClassName$9.FADE)) {
        element.classList.add(ClassName$9.SHOW);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab._jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Tab._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = 'toast';
  var VERSION$a = '4.3.1';
  var DATA_KEY$a = 'bs.toast';
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$a,
    HIDE: "hide" + EVENT_KEY$a,
    HIDDEN: "hidden" + EVENT_KEY$a,
    SHOW: "show" + EVENT_KEY$a,
    SHOWN: "shown" + EVENT_KEY$a
  };
  var ClassName$a = {
    FADE: 'fade',
    HIDE: 'hide',
    SHOW: 'show',
    SHOWING: 'showing'
  };
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var Selector$a = {
    DATA_DISMISS: '[data-dismiss="toast"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Toast =
  /*#__PURE__*/
  function () {
    function Toast(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    var _proto = Toast.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      $(this._element).trigger(Event$a.SHOW);

      if (this._config.animation) {
        this._element.classList.add(ClassName$a.FADE);
      }

      var complete = function complete() {
        _this._element.classList.remove(ClassName$a.SHOWING);

        _this._element.classList.add(ClassName$a.SHOW);

        $(_this._element).trigger(Event$a.SHOWN);

        if (_this._config.autohide) {
          _this.hide();
        }
      };

      this._element.classList.remove(ClassName$a.HIDE);

      this._element.classList.add(ClassName$a.SHOWING);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.hide = function hide(withoutTimeout) {
      var _this2 = this;

      if (!this._element.classList.contains(ClassName$a.SHOW)) {
        return;
      }

      $(this._element).trigger(Event$a.HIDE);

      if (withoutTimeout) {
        this._close();
      } else {
        this._timeout = setTimeout(function () {
          _this2._close();
        }, this._config.delay);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      this._timeout = null;

      if (this._element.classList.contains(ClassName$a.SHOW)) {
        this._element.classList.remove(ClassName$a.SHOW);
      }

      $(this._element).off(Event$a.CLICK_DISMISS);
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
      this._config = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$7, $(this._element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      $(this._element).on(Event$a.CLICK_DISMISS, Selector$a.DATA_DISMISS, function () {
        return _this3.hide(true);
      });
    };

    _proto._close = function _close() {
      var _this4 = this;

      var complete = function complete() {
        _this4._element.classList.add(ClassName$a.HIDE);

        $(_this4._element).trigger(Event$a.HIDDEN);
      };

      this._element.classList.remove(ClassName$a.SHOW);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    } // Static
    ;

    Toast._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY$a);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })();

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bootstrap.js.map


/***/ }),
/* 21 */
/*!*************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/popper.js/dist/esm/popper.js ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.14.7
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/* harmony default export */ __webpack_exports__["default"] = (Popper);
//# sourceMappingURL=popper.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 22)))

/***/ }),
/* 22 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 23 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 24);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  document.dispatchEvent(new CustomEvent('routed', {
    bubbles: true,
    detail: {
      route: route,
      fn: event,
    },
  }));
    
  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 24 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 25 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on all pages
  },
  finalize: function finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
});


/***/ }),
/* 26 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the home page
  },
  finalize: function finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
});


/***/ }),
/* 27 */
/*!*********************************!*\
  !*** ./scripts/routes/about.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the about us page
  },
});


/***/ }),
/* 28 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ 30)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16, function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/*!***********************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/css-loader/lib/css-base.js ***!
  \***********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 30 */
/*!**************************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/style-loader/lib/addStyles.js ***!
  \**************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 31);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {
		return null;
	}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 31 */
/*!*********************************************************************************************************!*\
  !*** C:/xampp/apps/wordpress/htdocs/wp-content/themes/acma-theme/node_modules/style-loader/lib/urls.js ***!
  \*********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map