import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __commonJS,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/lodash.mergewith/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.mergewith/index.js"(exports, module) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function overArg(func, transform2) {
      return function(arg) {
        return func(transform2(arg));
      };
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var objectCtorString = funcToString.call(Object);
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer = moduleExports ? root.Buffer : void 0;
    var Symbol = root.Symbol;
    var Uint8Array = root.Uint8Array;
    var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    var objectCreate = Object.create;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    }();
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
    var nativeMax = Math.max;
    var nativeNow = Date.now;
    var Map2 = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    var baseCreate = /* @__PURE__ */ function() {
      function object() {
      }
      return function(proto) {
        if (!isObject2(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    var baseFor = createBaseFor();
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction3(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeysIn(object) {
      if (!isObject2(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject2(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray2(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray2(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject2(objValue) || isFunction3(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard2 = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard2 && isIterateeCall(sources[0], sources[1], guard2)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject2(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function overRest(func, start, transform2) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform2(array);
        return apply(func, this, otherArgs);
      };
    }
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    var setToString = shortOut(baseSetToString);
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray2 = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction3(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction3(value) {
      if (!isObject2(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });
    function constant(value) {
      return function() {
        return value;
      };
    }
    function identity(value) {
      return value;
    }
    function stubFalse() {
      return false;
    }
    module.exports = mergeWith;
  }
});

// node_modules/@chakra-ui/anatomy/dist/esm/create-anatomy.mjs
function anatomy(name, map = {}) {
  let called = false;
  function assert() {
    if (!called) {
      called = true;
      return;
    }
    throw new Error(
      "[anatomy] .part(...) should only be called once. Did you mean to use .extend(...) ?"
    );
  }
  function parts(...values) {
    assert();
    for (const part of values) {
      map[part] = toPart(part);
    }
    return anatomy(name, map);
  }
  function extend(...parts2) {
    for (const part of parts2) {
      if (part in map)
        continue;
      map[part] = toPart(part);
    }
    return anatomy(name, map);
  }
  function selectors() {
    const value = Object.fromEntries(
      Object.entries(map).map(([key, part]) => [key, part.selector])
    );
    return value;
  }
  function classnames() {
    const value = Object.fromEntries(
      Object.entries(map).map(([key, part]) => [key, part.className])
    );
    return value;
  }
  function toPart(part) {
    const el = ["container", "root"].includes(part ?? "") ? [name] : [name, part];
    const attr = el.filter(Boolean).join("__");
    const className = `chakra-${attr}`;
    const partObj = {
      className,
      selector: `.${className}`,
      toString: () => part
    };
    return partObj;
  }
  const __type = {};
  return {
    parts,
    toPart,
    extend,
    selectors,
    classnames,
    get keys() {
      return Object.keys(map);
    },
    __type
  };
}

// node_modules/@chakra-ui/anatomy/dist/esm/components.mjs
var accordionAnatomy = anatomy("accordion").parts(
  "root",
  "container",
  "button",
  "panel",
  "icon"
);
var alertAnatomy = anatomy("alert").parts(
  "title",
  "description",
  "container",
  "icon",
  "spinner"
);
var avatarAnatomy = anatomy("avatar").parts(
  "label",
  "badge",
  "container",
  "excessLabel",
  "group"
);
var breadcrumbAnatomy = anatomy("breadcrumb").parts(
  "link",
  "item",
  "container",
  "separator"
);
var buttonAnatomy = anatomy("button").parts();
var checkboxAnatomy = anatomy("checkbox").parts(
  "control",
  "icon",
  "container",
  "label"
);
var circularProgressAnatomy = anatomy("progress").parts(
  "track",
  "filledTrack",
  "label"
);
var drawerAnatomy = anatomy("drawer").parts(
  "overlay",
  "dialogContainer",
  "dialog",
  "header",
  "closeButton",
  "body",
  "footer"
);
var editableAnatomy = anatomy("editable").parts(
  "preview",
  "input",
  "textarea"
);
var formAnatomy = anatomy("form").parts(
  "container",
  "requiredIndicator",
  "helperText"
);
var formErrorAnatomy = anatomy("formError").parts("text", "icon");
var inputAnatomy = anatomy("input").parts(
  "addon",
  "field",
  "element",
  "group"
);
var listAnatomy = anatomy("list").parts("container", "item", "icon");
var menuAnatomy = anatomy("menu").parts(
  "button",
  "list",
  "item",
  "groupTitle",
  "icon",
  "command",
  "divider"
);
var modalAnatomy = anatomy("modal").parts(
  "overlay",
  "dialogContainer",
  "dialog",
  "header",
  "closeButton",
  "body",
  "footer"
);
var numberInputAnatomy = anatomy("numberinput").parts(
  "root",
  "field",
  "stepperGroup",
  "stepper"
);
var pinInputAnatomy = anatomy("pininput").parts("field");
var popoverAnatomy = anatomy("popover").parts(
  "content",
  "header",
  "body",
  "footer",
  "popper",
  "arrow",
  "closeButton"
);
var progressAnatomy = anatomy("progress").parts(
  "label",
  "filledTrack",
  "track"
);
var radioAnatomy = anatomy("radio").parts(
  "container",
  "control",
  "label"
);
var selectAnatomy = anatomy("select").parts("field", "icon");
var sliderAnatomy = anatomy("slider").parts(
  "container",
  "track",
  "thumb",
  "filledTrack",
  "mark"
);
var statAnatomy = anatomy("stat").parts(
  "container",
  "label",
  "helpText",
  "number",
  "icon"
);
var switchAnatomy = anatomy("switch").parts(
  "container",
  "track",
  "thumb",
  "label"
);
var tableAnatomy = anatomy("table").parts(
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "tfoot",
  "caption"
);
var tabsAnatomy = anatomy("tabs").parts(
  "root",
  "tab",
  "tablist",
  "tabpanel",
  "tabpanels",
  "indicator"
);
var tagAnatomy = anatomy("tag").parts(
  "container",
  "label",
  "closeButton"
);
var cardAnatomy = anatomy("card").parts(
  "container",
  "header",
  "body",
  "footer"
);
var stepperAnatomy = anatomy("stepper").parts(
  "stepper",
  "step",
  "title",
  "description",
  "indicator",
  "separator",
  "icon",
  "number"
);

// node_modules/@chakra-ui/utils/dist/esm/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options) {
  target.addEventListener(eventName, handler, options);
  return () => {
    target.removeEventListener(eventName, handler, options);
  };
}

// node_modules/@chakra-ui/utils/dist/esm/is-element.mjs
function isHTMLElement(el) {
  return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
}
function isBrowser() {
  return Boolean(globalThis == null ? void 0 : globalThis.document);
}
function isHiddenElement(element) {
  if (element.parentElement && isHiddenElement(element.parentElement))
    return true;
  return element.hidden;
}
function isContentEditableElement(element) {
  const value = element.getAttribute("contenteditable");
  return value !== "false" && value != null;
}
function isDisabledElement(element) {
  return Boolean(element.getAttribute("disabled")) === true || Boolean(element.getAttribute("aria-disabled")) === true;
}

// node_modules/@chakra-ui/utils/dist/esm/owner.mjs
function getOwnerWindow(node) {
  var _a;
  return ((_a = getOwnerDocument(node)) == null ? void 0 : _a.defaultView) ?? window;
}
function getOwnerDocument(node) {
  return isHTMLElement(node) ? node.ownerDocument : document;
}
function getEventWindow(event) {
  return event.view ?? window;
}
function getActiveElement(node) {
  return getOwnerDocument(node).activeElement;
}

// node_modules/@chakra-ui/utils/dist/esm/is-event.mjs
function isMouseEvent(event) {
  const win = getEventWindow(event);
  if (typeof win.PointerEvent !== "undefined" && event instanceof win.PointerEvent) {
    return !!(event.pointerType === "mouse");
  }
  return event instanceof win.MouseEvent;
}
function isTouchEvent(event) {
  const hasTouches = !!event.touches;
  return hasTouches;
}
function isMultiTouchEvent(event) {
  return isTouchEvent(event) && event.touches.length > 1;
}

// node_modules/@chakra-ui/utils/dist/esm/event-point.mjs
function pointFromTouch(e, type = "page") {
  const point = e.touches[0] || e.changedTouches[0];
  return { x: point[`${type}X`], y: point[`${type}Y`] };
}
function pointFromMouse(point, type = "page") {
  return {
    x: point[`${type}X`],
    y: point[`${type}Y`]
  };
}
function getEventPoint(event, type = "page") {
  return isTouchEvent(event) ? pointFromTouch(event, type) : pointFromMouse(event, type);
}

// node_modules/@chakra-ui/utils/dist/esm/add-pointer-event.mjs
function filter(cb) {
  return (event) => {
    const isMouse = isMouseEvent(event);
    if (!isMouse || isMouse && event.button === 0) {
      cb(event);
    }
  };
}
function wrap(cb, filterPrimary = false) {
  function listener(event) {
    cb(event, { point: getEventPoint(event) });
  }
  const fn = filterPrimary ? filter(listener) : listener;
  return fn;
}
function addPointerEvent(target, type, cb, options) {
  return addDomEvent(target, type, wrap(cb, type === "pointerdown"), options);
}

// node_modules/@chakra-ui/utils/dist/esm/assign-after.mjs
function assignAfter(target, ...sources) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  const result = { ...target };
  for (const nextSource of sources) {
    if (nextSource == null)
      continue;
    for (const nextKey in nextSource) {
      if (!Object.prototype.hasOwnProperty.call(nextSource, nextKey))
        continue;
      if (nextKey in result)
        delete result[nextKey];
      result[nextKey] = nextSource[nextKey];
    }
  }
  return result;
}

// node_modules/@chakra-ui/utils/dist/esm/attr.mjs
var dataAttr = (condition) => condition ? "" : void 0;
var ariaAttr = (condition) => condition ? true : void 0;

// node_modules/@chakra-ui/utils/dist/esm/is.mjs
function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}

// node_modules/@chakra-ui/utils/dist/esm/breakpoint.mjs
function getLastItem(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
function analyzeCSSValue(value) {
  const num = parseFloat(value.toString());
  const unit = value.toString().replace(String(num), "");
  return { unitless: !unit, value: num, unit };
}
function px(value) {
  if (value == null)
    return value;
  const { unitless } = analyzeCSSValue(value);
  return unitless || typeof value === "number" ? `${value}px` : value;
}
var sortByBreakpointValue = (a, b) => parseInt(a[1], 10) > parseInt(b[1], 10) ? 1 : -1;
var sortBps = (breakpoints2) => Object.fromEntries(Object.entries(breakpoints2).sort(sortByBreakpointValue));
function normalize(breakpoints2) {
  const sorted = sortBps(breakpoints2);
  return Object.assign(Object.values(sorted), sorted);
}
function keys(breakpoints2) {
  const value = Object.keys(sortBps(breakpoints2));
  return new Set(value);
}
function subtract(value) {
  if (!value)
    return value;
  value = px(value) ?? value;
  const OFFSET = -0.02;
  return typeof value === "number" ? `${value + OFFSET}` : value.replace(/(\d+\.?\d*)/u, (m) => `${parseFloat(m) + OFFSET}`);
}
function toMediaQueryString(min, max) {
  const query = ["@media screen"];
  if (min)
    query.push("and", `(min-width: ${px(min)})`);
  if (max)
    query.push("and", `(max-width: ${px(max)})`);
  return query.join(" ");
}
function analyzeBreakpoints(breakpoints2) {
  if (!breakpoints2)
    return null;
  breakpoints2.base = breakpoints2.base ?? "0px";
  const normalized = normalize(breakpoints2);
  const queries = Object.entries(breakpoints2).sort(sortByBreakpointValue).map(([breakpoint, minW], index, entry) => {
    let [, maxW] = entry[index + 1] ?? [];
    maxW = parseFloat(maxW) > 0 ? subtract(maxW) : void 0;
    return {
      _minW: subtract(minW),
      breakpoint,
      minW,
      maxW,
      maxWQuery: toMediaQueryString(null, maxW),
      minWQuery: toMediaQueryString(minW),
      minMaxQuery: toMediaQueryString(minW, maxW)
    };
  });
  const _keys = keys(breakpoints2);
  const _keysArr = Array.from(_keys.values());
  return {
    keys: _keys,
    normalized,
    isResponsive(test) {
      const keys2 = Object.keys(test);
      return keys2.length > 0 && keys2.every((key) => _keys.has(key));
    },
    asObject: sortBps(breakpoints2),
    asArray: normalize(breakpoints2),
    details: queries,
    get(key) {
      return queries.find((q) => q.breakpoint === key);
    },
    media: [
      null,
      ...normalized.map((minW) => toMediaQueryString(minW)).slice(1)
    ],
    /**
     * Converts the object responsive syntax to array syntax
     *
     * @example
     * toArrayValue({ base: 1, sm: 2, md: 3 }) // => [1, 2, 3]
     */
    toArrayValue(test) {
      if (!isObject(test)) {
        throw new Error("toArrayValue: value must be an object");
      }
      const result = _keysArr.map((bp) => test[bp] ?? null);
      while (getLastItem(result) === null) {
        result.pop();
      }
      return result;
    },
    /**
     * Converts the array responsive syntax to object syntax
     *
     * @example
     * toObjectValue([1, 2, 3]) // => { base: 1, sm: 2, md: 3 }
     */
    toObjectValue(test) {
      if (!Array.isArray(test)) {
        throw new Error("toObjectValue: value must be an array");
      }
      return test.reduce(
        (acc, value, index) => {
          const key = _keysArr[index];
          if (key != null && value != null)
            acc[key] = value;
          return acc;
        },
        {}
      );
    }
  };
}

// node_modules/@chakra-ui/utils/dist/esm/call-all.mjs
function callAll(...fns) {
  return function mergedFn(...args) {
    fns.forEach((fn) => fn == null ? void 0 : fn(...args));
  };
}
function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}

// node_modules/@chakra-ui/utils/dist/esm/children.mjs
var import_react = __toESM(require_react(), 1);
function getValidChildren(children) {
  return import_react.Children.toArray(children).filter(
    (child) => (0, import_react.isValidElement)(child)
  );
}

// node_modules/@chakra-ui/utils/dist/esm/compact.mjs
function compact(object) {
  const clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === void 0)
      delete clone[key];
  }
  return clone;
}

// node_modules/@chakra-ui/utils/dist/esm/context.mjs
var import_react2 = __toESM(require_react(), 1);
function getErrorMessage(hook, provider) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`;
}
function createContext(options = {}) {
  const {
    name,
    strict = true,
    hookName = "useContext",
    providerName = "Provider",
    errorMessage,
    defaultValue
  } = options;
  const Context = (0, import_react2.createContext)(defaultValue);
  Context.displayName = name;
  function useContext$1() {
    var _a;
    const context = (0, import_react2.useContext)(Context);
    if (!context && strict) {
      const error = new Error(
        errorMessage ?? getErrorMessage(hookName, providerName)
      );
      error.name = "ContextError";
      (_a = Error.captureStackTrace) == null ? void 0 : _a.call(Error, error, useContext$1);
      throw error;
    }
    return context;
  }
  return [Context.Provider, useContext$1, Context];
}

// node_modules/@chakra-ui/utils/dist/esm/cx.mjs
var cx = (...classNames) => classNames.filter(Boolean).join(" ");

// node_modules/@chakra-ui/utils/dist/esm/tabbable.mjs
var hasTabIndex = (element) => element.hasAttribute("tabindex");
var hasNegativeTabIndex = (element) => hasTabIndex(element) && element.tabIndex === -1;
function isFocusable(element) {
  if (!isHTMLElement(element) || isHiddenElement(element) || isDisabledElement(element)) {
    return false;
  }
  const { localName } = element;
  const focusableTags = ["input", "select", "textarea", "button"];
  if (focusableTags.indexOf(localName) >= 0)
    return true;
  const others2 = {
    a: () => element.hasAttribute("href"),
    audio: () => element.hasAttribute("controls"),
    video: () => element.hasAttribute("controls")
  };
  if (localName in others2) {
    return others2[localName]();
  }
  if (isContentEditableElement(element))
    return true;
  return hasTabIndex(element);
}
function isTabbable(element) {
  if (!element)
    return false;
  return isHTMLElement(element) && isFocusable(element) && !hasNegativeTabIndex(element);
}

// node_modules/@chakra-ui/utils/dist/esm/focusable.mjs
var focusableElList = [
  "input:not(:disabled):not([disabled])",
  "select:not(:disabled):not([disabled])",
  "textarea:not(:disabled):not([disabled])",
  "embed",
  "iframe",
  "object",
  "a[href]",
  "area[href]",
  "button:not(:disabled):not([disabled])",
  "[tabindex]",
  "audio[controls]",
  "video[controls]",
  "*[tabindex]:not([aria-disabled])",
  "*[contenteditable]"
];
var focusableElSelector = focusableElList.join();
var isVisible = (el) => el.offsetWidth > 0 && el.offsetHeight > 0;
function getAllFocusable(container) {
  const focusableEls = Array.from(
    container.querySelectorAll(focusableElSelector)
  );
  focusableEls.unshift(container);
  return focusableEls.filter((el) => isFocusable(el) && isVisible(el));
}

// node_modules/@chakra-ui/utils/dist/esm/get.mjs
function get(obj, path, fallback, index) {
  const key = typeof path === "string" ? path.split(".") : [path];
  for (index = 0; index < key.length; index += 1) {
    if (!obj)
      break;
    obj = obj[key[index]];
  }
  return obj === void 0 ? fallback : obj;
}
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new WeakMap();
  const memoizedFn = (obj, path, fallback, index) => {
    if (typeof obj === "undefined") {
      return fn(obj, path, fallback);
    }
    if (!cache.has(obj)) {
      cache.set(obj, /* @__PURE__ */ new Map());
    }
    const map = cache.get(obj);
    if (map.has(path)) {
      return map.get(path);
    }
    const value = fn(obj, path, fallback, index);
    map.set(path, value);
    return value;
  };
  return memoizedFn;
};
var memoizedGet = memoize(get);

// node_modules/@chakra-ui/utils/dist/esm/interop-default.mjs
var interopDefault = (mod) => mod.default || mod;

// node_modules/@chakra-ui/utils/dist/esm/lazy.mjs
function lazyDisclosure(options) {
  const { wasSelected, enabled, isSelected, mode: mode2 = "unmount" } = options;
  if (!enabled)
    return true;
  if (isSelected)
    return true;
  if (mode2 === "keepMounted" && wasSelected)
    return true;
  return false;
}

// node_modules/@chakra-ui/utils/dist/esm/number.mjs
function toNumber(value) {
  const num = parseFloat(value);
  return typeof num !== "number" || Number.isNaN(num) ? 0 : num;
}
function toPrecision(value, precision) {
  let nextValue = toNumber(value);
  const scaleFactor = 10 ** (precision ?? 10);
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor;
  return precision ? nextValue.toFixed(precision) : nextValue.toString();
}
function countDecimalPlaces(value) {
  if (!Number.isFinite(value))
    return 0;
  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
}
function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
}
function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}
function roundValueToStep(value, from, step) {
  const nextValue = Math.round((value - from) / step) * step + from;
  const precision = countDecimalPlaces(step);
  return toPrecision(nextValue, precision);
}
function clampValue(value, min, max) {
  if (value == null)
    return value;
  if (max < min) {
    console.warn("clamp: max cannot be less than min");
  }
  return Math.min(Math.max(value, min), max);
}

// node_modules/@chakra-ui/utils/dist/esm/omit.mjs
function omit(object, keysToOmit = []) {
  const clone = Object.assign({}, object);
  for (const key of keysToOmit) {
    if (key in clone) {
      delete clone[key];
    }
  }
  return clone;
}

// node_modules/@chakra-ui/utils/dist/esm/pick.mjs
function pick(object, keysToPick) {
  const result = {};
  for (const key of keysToPick) {
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

// node_modules/@chakra-ui/utils/dist/esm/responsive.mjs
var breakpoints = Object.freeze([
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
]);
function mapResponsive(prop, mapper) {
  if (Array.isArray(prop)) {
    return prop.map((item) => item === null ? null : mapper(item));
  }
  if (isObject(prop)) {
    return Object.keys(prop).reduce((result, key) => {
      result[key] = mapper(prop[key]);
      return result;
    }, {});
  }
  if (prop != null) {
    return mapper(prop);
  }
  return null;
}
function arrayToObjectNotation(values, bps = breakpoints) {
  const result = {};
  values.forEach((value, index) => {
    const key = bps[index];
    if (value == null)
      return;
    result[key] = value;
  });
  return result;
}

// node_modules/@chakra-ui/utils/dist/esm/run-if-fn.mjs
var isFunction = (value) => typeof value === "function";
function runIfFn(valueOrFn, ...args) {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

// node_modules/@chakra-ui/utils/dist/esm/scroll-parent.mjs
function isScrollParent(el) {
  const win = el.ownerDocument.defaultView || window;
  const { overflow, overflowX, overflowY } = win.getComputedStyle(el);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getParent(el) {
  if (el.localName === "html")
    return el;
  return el.assignedSlot || el.parentElement || el.ownerDocument.documentElement;
}
function getScrollParent(el) {
  if (["html", "body", "#document"].includes(el.localName)) {
    return el.ownerDocument.body;
  }
  if (isHTMLElement(el) && isScrollParent(el)) {
    return el;
  }
  return getScrollParent(getParent(el));
}

// node_modules/@chakra-ui/utils/dist/esm/split.mjs
function split(object, keys2) {
  const picked = {};
  const omitted = {};
  for (const [key, value] of Object.entries(object)) {
    if (keys2.includes(key))
      picked[key] = value;
    else
      omitted[key] = value;
  }
  return [picked, omitted];
}

// node_modules/@chakra-ui/utils/dist/esm/split-props.mjs
function splitProps(props, ...keys2) {
  const descriptors = Object.getOwnPropertyDescriptors(props);
  const dKeys = Object.keys(descriptors);
  const split2 = (k) => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  const fn = (key) => split2(Array.isArray(key) ? key : dKeys.filter(key));
  return keys2.map(fn).concat(split2(dKeys));
}

// node_modules/@chakra-ui/utils/dist/esm/walk-object.mjs
function walkObject(target, predicate, options = {}) {
  const { stop, getKey } = options;
  function inner(value, path = []) {
    if (isObject(value) || Array.isArray(value)) {
      const result = {};
      for (const [prop, child] of Object.entries(value)) {
        const key = (getKey == null ? void 0 : getKey(prop)) ?? prop;
        const childPath = [...path, key];
        if (stop == null ? void 0 : stop(value, childPath)) {
          return predicate(value, path);
        }
        result[key] = inner(child, childPath);
      }
      return result;
    }
    return predicate(value, path);
  }
  return inner(target);
}

// node_modules/@chakra-ui/utils/dist/esm/warn.mjs
var warn = (options) => {
  const { condition, message } = options;
  if (condition && true) {
    console.warn(message);
  }
};

// node_modules/@chakra-ui/utils/dist/esm/index.mjs
var import_lodash = __toESM(require_lodash(), 1);

// node_modules/@chakra-ui/styled-system/dist/esm/pseudos.mjs
var state = {
  open: (str, post) => `${str}[data-open], ${str}[open], ${str}[data-state=open] ${post}`,
  closed: (str, post) => `${str}[data-closed], ${str}[data-state=closed] ${post}`,
  hover: (str, post) => `${str}:hover ${post}, ${str}[data-hover] ${post}`,
  focus: (str, post) => `${str}:focus ${post}, ${str}[data-focus] ${post}`,
  focusVisible: (str, post) => `${str}:focus-visible ${post}`,
  focusWithin: (str, post) => `${str}:focus-within ${post}`,
  active: (str, post) => `${str}:active ${post}, ${str}[data-active] ${post}`,
  disabled: (str, post) => `${str}:disabled ${post}, ${str}[data-disabled] ${post}`,
  invalid: (str, post) => `${str}:invalid ${post}, ${str}[data-invalid] ${post}`,
  checked: (str, post) => `${str}:checked ${post}, ${str}[data-checked] ${post}`,
  indeterminate: (str, post) => `${str}:indeterminate ${post}, ${str}[aria-checked=mixed] ${post}, ${str}[data-indeterminate] ${post}`,
  readOnly: (str, post) => `${str}:read-only ${post}, ${str}[readonly] ${post}, ${str}[data-read-only] ${post}`,
  expanded: (str, post) => `${str}:read-only ${post}, ${str}[aria-expanded=true] ${post}, ${str}[data-expanded] ${post}`,
  placeholderShown: (str, post) => `${str}:placeholder-shown ${post}`
};
var toGroup = (fn) => merge((v) => fn(v, "&"), "[role=group]", "[data-group]", ".group");
var toPeer = (fn) => merge((v) => fn(v, "~ &"), "[data-peer]", ".peer");
var merge = (fn, ...selectors) => selectors.map(fn).join(", ");
var pseudoSelectors = {
  /**
   * Styles for CSS selector `&:hover`
   */
  _hover: "&:hover, &[data-hover]",
  /**
   * Styles for CSS Selector `&:active`
   */
  _active: "&:active, &[data-active]",
  /**
   * Styles for CSS selector `&:focus`
   *
   */
  _focus: "&:focus, &[data-focus]",
  /**
   * Styles for the highlighted state.
   */
  _highlighted: "&[data-highlighted]",
  /**
   * Styles to apply when a child of this element has received focus
   * - CSS Selector `&:focus-within`
   */
  _focusWithin: "&:focus-within, &[data-focus-within]",
  /**
   * Styles to apply when this element has received focus via tabbing
   * - CSS Selector `&:focus-visible`
   */
  _focusVisible: "&:focus-visible, &[data-focus-visible]",
  /**
   * Styles to apply when this element is disabled. The passed styles are applied to these CSS selectors:
   * - `&[aria-disabled=true]`
   * - `&:disabled`
   * - `&[data-disabled]`
   * - `&[disabled]`
   */
  _disabled: "&:disabled, &[disabled], &[aria-disabled=true], &[data-disabled]",
  /**
   * Styles for CSS Selector `&:readonly`
   */
  _readOnly: "&[aria-readonly=true], &[readonly], &[data-readonly]",
  /**
   * Styles for CSS selector `&::before`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <Box _before={{content:`""` }}/>
   * ```
   */
  _before: "&::before",
  /**
   * Styles for CSS selector `&::after`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <Box _after={{content:`""` }}/>
   * ```
   */
  _after: "&::after",
  /**
   * Styles for CSS selector `&:empty`
   */
  _empty: "&:empty, &[data-empty]",
  /**
   * Styles to apply when the ARIA attribute `aria-expanded` is `true`
   * - CSS selector `&[aria-expanded=true]`
   */
  _expanded: "&[aria-expanded=true], &[data-expanded], &[data-state=expanded]",
  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `true`
   * - CSS selector `&[aria-checked=true]`
   */
  _checked: "&[aria-checked=true], &[data-checked], &[data-state=checked]",
  /**
   * Styles to apply when the ARIA attribute `aria-grabbed` is `true`
   * - CSS selector `&[aria-grabbed=true]`
   */
  _grabbed: "&[aria-grabbed=true], &[data-grabbed]",
  /**
   * Styles for CSS Selector `&[aria-pressed=true]`
   * Typically used to style the current "pressed" state of toggle buttons
   */
  _pressed: "&[aria-pressed=true], &[data-pressed]",
  /**
   * Styles to apply when the ARIA attribute `aria-invalid` is `true`
   * - CSS selector `&[aria-invalid=true]`
   */
  _invalid: "&[aria-invalid=true], &[data-invalid]",
  /**
   * Styles for the valid state
   * - CSS selector `&[data-valid], &[data-state=valid]`
   */
  _valid: "&[data-valid], &[data-state=valid]",
  /**
   * Styles for CSS Selector `&[aria-busy=true]` or `&[data-loading=true]`.
   * Useful for styling loading states
   */
  _loading: "&[data-loading], &[aria-busy=true]",
  /**
   * Styles to apply when the ARIA attribute `aria-selected` is `true`
   *
   * - CSS selector `&[aria-selected=true]`
   */
  _selected: "&[aria-selected=true], &[data-selected]",
  /**
   * Styles for CSS Selector `[hidden=true]`
   */
  _hidden: "&[hidden], &[data-hidden]",
  /**
   * Styles for CSS Selector `&:-webkit-autofill`
   */
  _autofill: "&:-webkit-autofill",
  /**
   * Styles for CSS Selector `&:nth-child(even)`
   */
  _even: "&:nth-of-type(even)",
  /**
   * Styles for CSS Selector `&:nth-child(odd)`
   */
  _odd: "&:nth-of-type(odd)",
  /**
   * Styles for CSS Selector `&:first-of-type`
   */
  _first: "&:first-of-type",
  /**
   * Styles for CSS selector `&::first-letter`
   *
   * NOTE: This selector is only applied for block-level elements and not preceded by an image or table.
   * @example
   * ```jsx
   * <Text _firstLetter={{ textDecoration: 'underline' }}>Once upon a time</Text>
   * ```
   */
  _firstLetter: "&::first-letter",
  /**
   * Styles for CSS Selector `&:last-of-type`
   */
  _last: "&:last-of-type",
  /**
   * Styles for CSS Selector `&:not(:first-of-type)`
   */
  _notFirst: "&:not(:first-of-type)",
  /**
   * Styles for CSS Selector `&:not(:last-of-type)`
   */
  _notLast: "&:not(:last-of-type)",
  /**
   * Styles for CSS Selector `&:visited`
   */
  _visited: "&:visited",
  /**
   * Used to style the active link in a navigation
   * Styles for CSS Selector `&[aria-current=page]`
   */
  _activeLink: "&[aria-current=page]",
  /**
   * Used to style the current step within a process
   * Styles for CSS Selector `&[aria-current=step]`
   */
  _activeStep: "&[aria-current=step]",
  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `mixed`
   * - CSS selector `&[aria-checked=mixed]`
   */
  _indeterminate: "&:indeterminate, &[aria-checked=mixed], &[data-indeterminate], &[data-state=indeterminate]",
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is open
   */
  _groupOpen: toGroup(state.open),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is closed
   */
  _groupClosed: toGroup(state.closed),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is hovered
   */
  _groupHover: toGroup(state.hover),
  /**
   * Styles to apply when a sibling element with `.peer` or `data-peer` is hovered
   */
  _peerHover: toPeer(state.hover),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is focused
   */
  _groupFocus: toGroup(state.focus),
  /**
   * Styles to apply when a sibling element with `.peer` or `data-peer` is focused
   */
  _peerFocus: toPeer(state.focus),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` has visible focus
   */
  _groupFocusVisible: toGroup(state.focusVisible),
  /**
   * Styles to apply when a sibling element with `.peer`or `data-peer` has visible focus
   */
  _peerFocusVisible: toPeer(state.focusVisible),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is active
   */
  _groupActive: toGroup(state.active),
  /**
   * Styles to apply when a sibling element with `.peer` or `data-peer` is active
   */
  _peerActive: toPeer(state.active),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is disabled
   */
  _groupDisabled: toGroup(state.disabled),
  /**
   *  Styles to apply when a sibling element with `.peer` or `data-peer` is disabled
   */
  _peerDisabled: toPeer(state.disabled),
  /**
   *  Styles to apply when a parent element with `.group`, `data-group` or `role=group` is invalid
   */
  _groupInvalid: toGroup(state.invalid),
  /**
   *  Styles to apply when a sibling element with `.peer` or `data-peer` is invalid
   */
  _peerInvalid: toPeer(state.invalid),
  /**
   * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is checked
   */
  _groupChecked: toGroup(state.checked),
  /**
   * Styles to apply when a sibling element with `.peer` or `data-peer` is checked
   */
  _peerChecked: toPeer(state.checked),
  /**
   *  Styles to apply when a parent element with `.group`, `data-group` or `role=group` has focus within
   */
  _groupFocusWithin: toGroup(state.focusWithin),
  /**
   *  Styles to apply when a sibling element with `.peer` or `data-peer` has focus within
   */
  _peerFocusWithin: toPeer(state.focusWithin),
  /**
   * Styles to apply when a sibling element with `.peer` or `data-peer` has placeholder shown
   */
  _peerPlaceholderShown: toPeer(state.placeholderShown),
  /**
   * Styles for CSS Selector `&::placeholder`.
   */
  _placeholder: "&::placeholder, &[data-placeholder]",
  /**
   * Styles for CSS Selector `&:placeholder-shown`.
   */
  _placeholderShown: "&:placeholder-shown, &[data-placeholder-shown]",
  /**
   * Styles for CSS Selector `&:fullscreen`.
   */
  _fullScreen: "&:fullscreen, &[data-fullscreen]",
  /**
   * Styles for CSS Selector `&::selection`
   */
  _selection: "&::selection",
  /**
   * Styles for CSS Selector `[dir=rtl] &`
   * It is applied when a parent element or this element has `dir="rtl"`
   */
  _rtl: "[dir=rtl] &, &[dir=rtl]",
  /**
   * Styles for CSS Selector `[dir=ltr] &`
   * It is applied when a parent element or this element has `dir="ltr"`
   */
  _ltr: "[dir=ltr] &, &[dir=ltr]",
  /**
   * Styles for CSS Selector `@media (prefers-color-scheme: dark)`
   * It is used when the user has requested the system use a light or dark color theme.
   */
  _mediaDark: "@media (prefers-color-scheme: dark)",
  /**
   * Styles for CSS Selector `@media (prefers-reduced-motion: reduce)`
   * It is used when the user has requested the system to reduce the amount of animations.
   */
  _mediaReduceMotion: "@media (prefers-reduced-motion: reduce)",
  /**
   * Styles for when `data-theme` is applied to any parent of
   * this component or element.
   */
  _dark: ".chakra-ui-dark &:not([data-theme]),[data-theme=dark] &:not([data-theme]),&[data-theme=dark]",
  /**
   * Styles for when `data-theme` is applied to any parent of
   * this component or element.
   */
  _light: ".chakra-ui-light &:not([data-theme]),[data-theme=light] &:not([data-theme]),&[data-theme=light]",
  /**
   * Styles for the CSS Selector `&[data-orientation=horizontal]`
   */
  _horizontal: "&[data-orientation=horizontal]",
  /**
   * Styles for the CSS Selector `&[data-orientation=vertical]`
   */
  _vertical: "&[data-orientation=vertical]",
  /**
   * Styles for the CSS Selector `&[data-open], &[open], &[data-state=open]`
   */
  _open: "&[data-open], &[open], &[data-state=open]",
  /**
   * Styles for the CSS Selector `&[data-closed], &[data-state=closed]`
   */
  _closed: "&[data-closed], &[data-state=closed]",
  /**
   * Styles for the CSS Selector `&[data-complete]`
   */
  _complete: "&[data-complete]",
  /**
   * Styles for the CSS Selector `&[data-incomplete]`
   */
  _incomplete: "&[data-incomplete]",
  /**
   * Styles for the CSS Selector `&[data-current]`
   */
  _current: "&[data-current]"
};
var pseudoPropNames = Object.keys(
  pseudoSelectors
);

// node_modules/@chakra-ui/styled-system/dist/esm/utils/create-transform.mjs
var isImportant = (value) => /!(important)?$/.test(value);
var withoutImportant = (value) => typeof value === "string" ? value.replace(/!(important)?$/, "").trim() : value;
var tokenToCSSVar = (scale, value) => (theme) => {
  const valueStr = String(value);
  const important = isImportant(valueStr);
  const valueWithoutImportant = withoutImportant(valueStr);
  const key = scale ? `${scale}.${valueWithoutImportant}` : valueWithoutImportant;
  let transformed = isObject(theme.__cssMap) && key in theme.__cssMap ? theme.__cssMap[key].varRef : value;
  transformed = withoutImportant(transformed);
  return important ? `${transformed} !important` : transformed;
};
function createTransform(options) {
  const { scale, transform: transform2, compose } = options;
  const fn = (value, theme) => {
    const _value = tokenToCSSVar(scale, value)(theme);
    let result = (transform2 == null ? void 0 : transform2(_value, theme)) ?? _value;
    if (compose) {
      result = compose(result, theme);
    }
    return result;
  };
  return fn;
}

// node_modules/@chakra-ui/styled-system/dist/esm/utils/pipe.mjs
var pipe = (...fns) => (v) => fns.reduce((a, b) => b(a), v);

// node_modules/@chakra-ui/styled-system/dist/esm/utils/prop-config.mjs
function toConfig(scale, transform2) {
  return (property) => {
    const result = { property, scale };
    result.transform = createTransform({
      scale,
      transform: transform2
    });
    return result;
  };
}
var getRtl = ({ rtl, ltr }) => (theme) => theme.direction === "rtl" ? rtl : ltr;
function logical(options) {
  const { property, scale, transform: transform2 } = options;
  return {
    scale,
    property: getRtl(property),
    transform: scale ? createTransform({
      scale,
      compose: transform2
    }) : transform2
  };
}

// node_modules/@chakra-ui/styled-system/dist/esm/utils/templates.mjs
var transformTemplate = [
  "rotate(var(--chakra-rotate, 0))",
  "scaleX(var(--chakra-scale-x, 1))",
  "scaleY(var(--chakra-scale-y, 1))",
  "skewX(var(--chakra-skew-x, 0))",
  "skewY(var(--chakra-skew-y, 0))"
];
function getTransformTemplate() {
  return [
    "translateX(var(--chakra-translate-x, 0))",
    "translateY(var(--chakra-translate-y, 0))",
    ...transformTemplate
  ].join(" ");
}
function getTransformGpuTemplate() {
  return [
    "translate3d(var(--chakra-translate-x, 0), var(--chakra-translate-y, 0), 0)",
    ...transformTemplate
  ].join(" ");
}
var filterTemplate = {
  "--chakra-blur": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-invert": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-drop-shadow": "var(--chakra-empty,/*!*/ /*!*/)",
  filter: [
    "var(--chakra-blur)",
    "var(--chakra-brightness)",
    "var(--chakra-contrast)",
    "var(--chakra-grayscale)",
    "var(--chakra-hue-rotate)",
    "var(--chakra-invert)",
    "var(--chakra-saturate)",
    "var(--chakra-sepia)",
    "var(--chakra-drop-shadow)"
  ].join(" ")
};
var backdropFilterTemplate = {
  backdropFilter: [
    "var(--chakra-backdrop-blur)",
    "var(--chakra-backdrop-brightness)",
    "var(--chakra-backdrop-contrast)",
    "var(--chakra-backdrop-grayscale)",
    "var(--chakra-backdrop-hue-rotate)",
    "var(--chakra-backdrop-invert)",
    "var(--chakra-backdrop-opacity)",
    "var(--chakra-backdrop-saturate)",
    "var(--chakra-backdrop-sepia)"
  ].join(" "),
  "--chakra-backdrop-blur": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-invert": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-opacity": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-sepia": "var(--chakra-empty,/*!*/ /*!*/)"
};
function getRingTemplate(value) {
  return {
    "--chakra-ring-offset-shadow": `var(--chakra-ring-inset) 0 0 0 var(--chakra-ring-offset-width) var(--chakra-ring-offset-color)`,
    "--chakra-ring-shadow": `var(--chakra-ring-inset) 0 0 0 calc(var(--chakra-ring-width) + var(--chakra-ring-offset-width)) var(--chakra-ring-color)`,
    "--chakra-ring-width": value,
    boxShadow: [
      `var(--chakra-ring-offset-shadow)`,
      `var(--chakra-ring-shadow)`,
      `var(--chakra-shadow, 0 0 #0000)`
    ].join(", ")
  };
}
var flexDirectionTemplate = {
  "row-reverse": {
    space: "--chakra-space-x-reverse",
    divide: "--chakra-divide-x-reverse"
  },
  "column-reverse": {
    space: "--chakra-space-y-reverse",
    divide: "--chakra-divide-y-reverse"
  }
};

// node_modules/@chakra-ui/styled-system/dist/esm/utils/parse-gradient.mjs
var directionMap = {
  "to-t": "to top",
  "to-tr": "to top right",
  "to-r": "to right",
  "to-br": "to bottom right",
  "to-b": "to bottom",
  "to-bl": "to bottom left",
  "to-l": "to left",
  "to-tl": "to top left"
};
var valueSet = new Set(Object.values(directionMap));
var globalSet = /* @__PURE__ */ new Set([
  "none",
  "-moz-initial",
  "inherit",
  "initial",
  "revert",
  "unset"
]);
var trimSpace = (str) => str.trim();
function parseGradient(value, theme) {
  if (value == null || globalSet.has(value))
    return value;
  const prevent = isCSSFunction(value) || globalSet.has(value);
  if (!prevent)
    return `url('${value}')`;
  const regex = /(^[a-z-A-Z]+)\((.*)\)/g;
  const results = regex.exec(value);
  const type = results == null ? void 0 : results[1];
  const values = results == null ? void 0 : results[2];
  if (!type || !values)
    return value;
  const _type = type.includes("-gradient") ? type : `${type}-gradient`;
  const [maybeDirection, ...stops] = values.split(",").map(trimSpace).filter(Boolean);
  if ((stops == null ? void 0 : stops.length) === 0)
    return value;
  const direction = maybeDirection in directionMap ? directionMap[maybeDirection] : maybeDirection;
  stops.unshift(direction);
  const _values = stops.map((stop) => {
    if (valueSet.has(stop))
      return stop;
    const firstStop = stop.indexOf(" ");
    const [_color, _stop] = firstStop !== -1 ? [stop.substr(0, firstStop), stop.substr(firstStop + 1)] : [stop];
    const _stopOrFunc = isCSSFunction(_stop) ? _stop : _stop && _stop.split(" ");
    const key = `colors.${_color}`;
    const color2 = key in theme.__cssMap ? theme.__cssMap[key].varRef : _color;
    return _stopOrFunc ? [
      color2,
      ...Array.isArray(_stopOrFunc) ? _stopOrFunc : [_stopOrFunc]
    ].join(" ") : color2;
  });
  return `${_type}(${_values.join(", ")})`;
}
var isCSSFunction = (value) => {
  return typeof value === "string" && value.includes("(") && value.includes(")");
};
var gradientTransform = (value, theme) => parseGradient(value, theme ?? {});

// node_modules/@chakra-ui/styled-system/dist/esm/utils/transform-functions.mjs
function isCssVar2(value) {
  return /^var\(--.+\)$/.test(value);
}
var analyzeCSSValue2 = (value) => {
  const num = parseFloat(value.toString());
  const unit = value.toString().replace(String(num), "");
  return { unitless: !unit, value: num, unit };
};
var wrap2 = (str) => (value) => `${str}(${value})`;
var transformFunctions = {
  filter(value) {
    return value !== "auto" ? value : filterTemplate;
  },
  backdropFilter(value) {
    return value !== "auto" ? value : backdropFilterTemplate;
  },
  ring(value) {
    return getRingTemplate(transformFunctions.px(value));
  },
  bgClip(value) {
    return value === "text" ? { color: "transparent", backgroundClip: "text" } : { backgroundClip: value };
  },
  transform(value) {
    if (value === "auto")
      return getTransformTemplate();
    if (value === "auto-gpu")
      return getTransformGpuTemplate();
    return value;
  },
  vh(value) {
    return value === "$100vh" ? "var(--chakra-vh)" : value;
  },
  px(value) {
    if (value == null)
      return value;
    const { unitless } = analyzeCSSValue2(value);
    return unitless || typeof value === "number" ? `${value}px` : value;
  },
  fraction(value) {
    return !(typeof value === "number") || value > 1 ? value : `${value * 100}%`;
  },
  float(value, theme) {
    const map = { left: "right", right: "left" };
    return theme.direction === "rtl" ? map[value] : value;
  },
  degree(value) {
    if (isCssVar2(value) || value == null)
      return value;
    const unitless = typeof value === "string" && !value.endsWith("deg");
    return typeof value === "number" || unitless ? `${value}deg` : value;
  },
  gradient: gradientTransform,
  blur: wrap2("blur"),
  opacity: wrap2("opacity"),
  brightness: wrap2("brightness"),
  contrast: wrap2("contrast"),
  dropShadow: wrap2("drop-shadow"),
  grayscale: wrap2("grayscale"),
  hueRotate: (value) => wrap2("hue-rotate")(transformFunctions.degree(value)),
  invert: wrap2("invert"),
  saturate: wrap2("saturate"),
  sepia: wrap2("sepia"),
  bgImage(value) {
    if (value == null)
      return value;
    const prevent = isCSSFunction(value) || globalSet.has(value);
    return !prevent ? `url(${value})` : value;
  },
  outline(value) {
    const isNoneOrZero = String(value) === "0" || String(value) === "none";
    return value !== null && isNoneOrZero ? { outline: "2px solid transparent", outlineOffset: "2px" } : { outline: value };
  },
  flexDirection(value) {
    const { space: space2, divide: divide3 } = flexDirectionTemplate[value] ?? {};
    const result = { flexDirection: value };
    if (space2)
      result[space2] = 1;
    if (divide3)
      result[divide3] = 1;
    return result;
  }
};

// node_modules/@chakra-ui/styled-system/dist/esm/utils/index.mjs
var t = {
  borderWidths: toConfig("borderWidths"),
  borderStyles: toConfig("borderStyles"),
  colors: toConfig("colors"),
  borders: toConfig("borders"),
  gradients: toConfig("gradients", transformFunctions.gradient),
  radii: toConfig("radii", transformFunctions.px),
  space: toConfig("space", pipe(transformFunctions.vh, transformFunctions.px)),
  spaceT: toConfig("space", pipe(transformFunctions.vh, transformFunctions.px)),
  degreeT(property) {
    return { property, transform: transformFunctions.degree };
  },
  prop(property, scale, transform2) {
    return {
      property,
      scale,
      ...scale && {
        transform: createTransform({ scale, transform: transform2 })
      }
    };
  },
  propT(property, transform2) {
    return { property, transform: transform2 };
  },
  sizes: toConfig("sizes", pipe(transformFunctions.vh, transformFunctions.px)),
  sizesT: toConfig("sizes", pipe(transformFunctions.vh, transformFunctions.fraction)),
  shadows: toConfig("shadows"),
  logical,
  blur: toConfig("blur", transformFunctions.blur)
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/background.mjs
var background = {
  background: t.colors("background"),
  backgroundColor: t.colors("backgroundColor"),
  backgroundImage: t.gradients("backgroundImage"),
  backgroundSize: true,
  backgroundPosition: true,
  backgroundRepeat: true,
  backgroundAttachment: true,
  backgroundClip: { transform: transformFunctions.bgClip },
  bgSize: t.prop("backgroundSize"),
  bgPosition: t.prop("backgroundPosition"),
  bg: t.colors("background"),
  bgColor: t.colors("backgroundColor"),
  bgPos: t.prop("backgroundPosition"),
  bgRepeat: t.prop("backgroundRepeat"),
  bgAttachment: t.prop("backgroundAttachment"),
  bgGradient: t.gradients("backgroundImage"),
  bgClip: { transform: transformFunctions.bgClip }
};
Object.assign(background, {
  bgImage: background.backgroundImage,
  bgImg: background.backgroundImage
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/border.mjs
var border = {
  border: t.borders("border"),
  borderWidth: t.borderWidths("borderWidth"),
  borderStyle: t.borderStyles("borderStyle"),
  borderColor: t.colors("borderColor"),
  borderRadius: t.radii("borderRadius"),
  borderTop: t.borders("borderTop"),
  borderBlockStart: t.borders("borderBlockStart"),
  borderTopLeftRadius: t.radii("borderTopLeftRadius"),
  borderStartStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderTopLeftRadius",
      rtl: "borderTopRightRadius"
    }
  }),
  borderEndStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderBottomLeftRadius",
      rtl: "borderBottomRightRadius"
    }
  }),
  borderTopRightRadius: t.radii("borderTopRightRadius"),
  borderStartEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderTopRightRadius",
      rtl: "borderTopLeftRadius"
    }
  }),
  borderEndEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderBottomRightRadius",
      rtl: "borderBottomLeftRadius"
    }
  }),
  borderRight: t.borders("borderRight"),
  borderInlineEnd: t.borders("borderInlineEnd"),
  borderBottom: t.borders("borderBottom"),
  borderBlockEnd: t.borders("borderBlockEnd"),
  borderBottomLeftRadius: t.radii("borderBottomLeftRadius"),
  borderBottomRightRadius: t.radii("borderBottomRightRadius"),
  borderLeft: t.borders("borderLeft"),
  borderInlineStart: {
    property: "borderInlineStart",
    scale: "borders"
  },
  borderInlineStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopLeftRadius", "borderBottomLeftRadius"],
      rtl: ["borderTopRightRadius", "borderBottomRightRadius"]
    }
  }),
  borderInlineEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopRightRadius", "borderBottomRightRadius"],
      rtl: ["borderTopLeftRadius", "borderBottomLeftRadius"]
    }
  }),
  borderX: t.borders(["borderLeft", "borderRight"]),
  borderInline: t.borders("borderInline"),
  borderY: t.borders(["borderTop", "borderBottom"]),
  borderBlock: t.borders("borderBlock"),
  borderTopWidth: t.borderWidths("borderTopWidth"),
  borderBlockStartWidth: t.borderWidths("borderBlockStartWidth"),
  borderTopColor: t.colors("borderTopColor"),
  borderBlockStartColor: t.colors("borderBlockStartColor"),
  borderTopStyle: t.borderStyles("borderTopStyle"),
  borderBlockStartStyle: t.borderStyles("borderBlockStartStyle"),
  borderBottomWidth: t.borderWidths("borderBottomWidth"),
  borderBlockEndWidth: t.borderWidths("borderBlockEndWidth"),
  borderBottomColor: t.colors("borderBottomColor"),
  borderBlockEndColor: t.colors("borderBlockEndColor"),
  borderBottomStyle: t.borderStyles("borderBottomStyle"),
  borderBlockEndStyle: t.borderStyles("borderBlockEndStyle"),
  borderLeftWidth: t.borderWidths("borderLeftWidth"),
  borderInlineStartWidth: t.borderWidths("borderInlineStartWidth"),
  borderLeftColor: t.colors("borderLeftColor"),
  borderInlineStartColor: t.colors("borderInlineStartColor"),
  borderLeftStyle: t.borderStyles("borderLeftStyle"),
  borderInlineStartStyle: t.borderStyles("borderInlineStartStyle"),
  borderRightWidth: t.borderWidths("borderRightWidth"),
  borderInlineEndWidth: t.borderWidths("borderInlineEndWidth"),
  borderRightColor: t.colors("borderRightColor"),
  borderInlineEndColor: t.colors("borderInlineEndColor"),
  borderRightStyle: t.borderStyles("borderRightStyle"),
  borderInlineEndStyle: t.borderStyles("borderInlineEndStyle"),
  borderTopRadius: t.radii(["borderTopLeftRadius", "borderTopRightRadius"]),
  borderBottomRadius: t.radii([
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ]),
  borderLeftRadius: t.radii(["borderTopLeftRadius", "borderBottomLeftRadius"]),
  borderRightRadius: t.radii([
    "borderTopRightRadius",
    "borderBottomRightRadius"
  ])
};
Object.assign(border, {
  rounded: border.borderRadius,
  roundedTop: border.borderTopRadius,
  roundedTopLeft: border.borderTopLeftRadius,
  roundedTopRight: border.borderTopRightRadius,
  roundedTopStart: border.borderStartStartRadius,
  roundedTopEnd: border.borderStartEndRadius,
  roundedBottom: border.borderBottomRadius,
  roundedBottomLeft: border.borderBottomLeftRadius,
  roundedBottomRight: border.borderBottomRightRadius,
  roundedBottomStart: border.borderEndStartRadius,
  roundedBottomEnd: border.borderEndEndRadius,
  roundedLeft: border.borderLeftRadius,
  roundedRight: border.borderRightRadius,
  roundedStart: border.borderInlineStartRadius,
  roundedEnd: border.borderInlineEndRadius,
  borderStart: border.borderInlineStart,
  borderEnd: border.borderInlineEnd,
  borderTopStartRadius: border.borderStartStartRadius,
  borderTopEndRadius: border.borderStartEndRadius,
  borderBottomStartRadius: border.borderEndStartRadius,
  borderBottomEndRadius: border.borderEndEndRadius,
  borderStartRadius: border.borderInlineStartRadius,
  borderEndRadius: border.borderInlineEndRadius,
  borderStartWidth: border.borderInlineStartWidth,
  borderEndWidth: border.borderInlineEndWidth,
  borderStartColor: border.borderInlineStartColor,
  borderEndColor: border.borderInlineEndColor,
  borderStartStyle: border.borderInlineStartStyle,
  borderEndStyle: border.borderInlineEndStyle
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/color.mjs
var color = {
  color: t.colors("color"),
  textColor: t.colors("color"),
  fill: t.colors("fill"),
  stroke: t.colors("stroke"),
  accentColor: t.colors("accentColor"),
  textFillColor: t.colors("textFillColor")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/flexbox.mjs
var flexbox = {
  alignItems: true,
  alignContent: true,
  justifyItems: true,
  justifyContent: true,
  flexWrap: true,
  flexDirection: { transform: transformFunctions.flexDirection },
  flex: true,
  flexFlow: true,
  flexGrow: true,
  flexShrink: true,
  flexBasis: t.sizes("flexBasis"),
  justifySelf: true,
  alignSelf: true,
  order: true,
  placeItems: true,
  placeContent: true,
  placeSelf: true,
  gap: t.space("gap"),
  rowGap: t.space("rowGap"),
  columnGap: t.space("columnGap")
};
Object.assign(flexbox, {
  flexDir: flexbox.flexDirection
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/layout.mjs
var layout = {
  width: t.sizesT("width"),
  inlineSize: t.sizesT("inlineSize"),
  height: t.sizes("height"),
  blockSize: t.sizes("blockSize"),
  boxSize: t.sizes(["width", "height"]),
  minWidth: t.sizes("minWidth"),
  minInlineSize: t.sizes("minInlineSize"),
  minHeight: t.sizes("minHeight"),
  minBlockSize: t.sizes("minBlockSize"),
  maxWidth: t.sizes("maxWidth"),
  maxInlineSize: t.sizes("maxInlineSize"),
  maxHeight: t.sizes("maxHeight"),
  maxBlockSize: t.sizes("maxBlockSize"),
  overflow: true,
  overflowX: true,
  overflowY: true,
  overscrollBehavior: true,
  overscrollBehaviorX: true,
  overscrollBehaviorY: true,
  display: true,
  aspectRatio: true,
  hideFrom: {
    scale: "breakpoints",
    transform: (value, theme) => {
      var _a, _b;
      const breakpoint = ((_b = (_a = theme.__breakpoints) == null ? void 0 : _a.get(value)) == null ? void 0 : _b.minW) ?? value;
      const mq = `@media screen and (min-width: ${breakpoint})`;
      return { [mq]: { display: "none" } };
    }
  },
  hideBelow: {
    scale: "breakpoints",
    transform: (value, theme) => {
      var _a, _b;
      const breakpoint = ((_b = (_a = theme.__breakpoints) == null ? void 0 : _a.get(value)) == null ? void 0 : _b._minW) ?? value;
      const mq = `@media screen and (max-width: ${breakpoint})`;
      return { [mq]: { display: "none" } };
    }
  },
  verticalAlign: true,
  boxSizing: true,
  boxDecorationBreak: true,
  float: t.propT("float", transformFunctions.float),
  objectFit: true,
  objectPosition: true,
  visibility: true,
  isolation: true
};
Object.assign(layout, {
  w: layout.width,
  h: layout.height,
  minW: layout.minWidth,
  maxW: layout.maxWidth,
  minH: layout.minHeight,
  maxH: layout.maxHeight,
  overscroll: layout.overscrollBehavior,
  overscrollX: layout.overscrollBehaviorX,
  overscrollY: layout.overscrollBehaviorY
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/filter.mjs
var filter2 = {
  filter: { transform: transformFunctions.filter },
  blur: t.blur("--chakra-blur"),
  brightness: t.propT("--chakra-brightness", transformFunctions.brightness),
  contrast: t.propT("--chakra-contrast", transformFunctions.contrast),
  hueRotate: t.propT("--chakra-hue-rotate", transformFunctions.hueRotate),
  invert: t.propT("--chakra-invert", transformFunctions.invert),
  saturate: t.propT("--chakra-saturate", transformFunctions.saturate),
  dropShadow: t.propT("--chakra-drop-shadow", transformFunctions.dropShadow),
  backdropFilter: { transform: transformFunctions.backdropFilter },
  backdropBlur: t.blur("--chakra-backdrop-blur"),
  backdropBrightness: t.propT(
    "--chakra-backdrop-brightness",
    transformFunctions.brightness
  ),
  backdropContrast: t.propT("--chakra-backdrop-contrast", transformFunctions.contrast),
  backdropHueRotate: t.propT(
    "--chakra-backdrop-hue-rotate",
    transformFunctions.hueRotate
  ),
  backdropInvert: t.propT("--chakra-backdrop-invert", transformFunctions.invert),
  backdropSaturate: t.propT("--chakra-backdrop-saturate", transformFunctions.saturate)
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/ring.mjs
var ring = {
  ring: { transform: transformFunctions.ring },
  ringColor: t.colors("--chakra-ring-color"),
  ringOffset: t.prop("--chakra-ring-offset-width"),
  ringOffsetColor: t.colors("--chakra-ring-offset-color"),
  ringInset: t.prop("--chakra-ring-inset")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/interactivity.mjs
var interactivity = {
  appearance: true,
  cursor: true,
  resize: true,
  userSelect: true,
  pointerEvents: true,
  outline: { transform: transformFunctions.outline },
  outlineOffset: true,
  outlineColor: t.colors("outlineColor")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/grid.mjs
var grid = {
  gridGap: t.space("gridGap"),
  gridColumnGap: t.space("gridColumnGap"),
  gridRowGap: t.space("gridRowGap"),
  gridColumn: true,
  gridRow: true,
  gridAutoFlow: true,
  gridAutoColumns: true,
  gridColumnStart: true,
  gridColumnEnd: true,
  gridRowStart: true,
  gridRowEnd: true,
  gridAutoRows: true,
  gridTemplate: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  gridTemplateAreas: true,
  gridArea: true
};

// node_modules/@chakra-ui/styled-system/dist/esm/get.mjs
function get2(obj, path, fallback, index) {
  const key = typeof path === "string" ? path.split(".") : [path];
  for (index = 0; index < key.length; index += 1) {
    if (!obj)
      break;
    obj = obj[key[index]];
  }
  return obj === void 0 ? fallback : obj;
}
var memoize2 = (fn) => {
  const cache = /* @__PURE__ */ new WeakMap();
  const memoizedFn = (obj, path, fallback, index) => {
    if (typeof obj === "undefined") {
      return fn(obj, path, fallback);
    }
    if (!cache.has(obj)) {
      cache.set(obj, /* @__PURE__ */ new Map());
    }
    const map = cache.get(obj);
    if (map.has(path)) {
      return map.get(path);
    }
    const value = fn(obj, path, fallback, index);
    map.set(path, value);
    return value;
  };
  return memoizedFn;
};
var memoizedGet2 = memoize2(get2);

// node_modules/@chakra-ui/styled-system/dist/esm/config/others.mjs
var srOnly = {
  border: "0px",
  clip: "rect(0, 0, 0, 0)",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: "0px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute"
};
var srFocusable = {
  position: "static",
  width: "auto",
  height: "auto",
  clip: "auto",
  padding: "0",
  margin: "0",
  overflow: "visible",
  whiteSpace: "normal"
};
var getWithPriority = (theme, key, styles) => {
  const result = {};
  const obj = memoizedGet2(theme, key, {});
  for (const prop in obj) {
    const isInStyles = prop in styles && styles[prop] != null;
    if (!isInStyles)
      result[prop] = obj[prop];
  }
  return result;
};
var others = {
  srOnly: {
    transform(value) {
      if (value === true)
        return srOnly;
      if (value === "focusable")
        return srFocusable;
      return {};
    }
  },
  layerStyle: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, `layerStyles.${value}`, styles)
  },
  textStyle: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, `textStyles.${value}`, styles)
  },
  apply: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, value, styles)
  }
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/position.mjs
var position = {
  position: true,
  pos: t.prop("position"),
  zIndex: t.prop("zIndex", "zIndices"),
  inset: t.spaceT("inset"),
  insetX: t.spaceT(["left", "right"]),
  insetInline: t.spaceT("insetInline"),
  insetY: t.spaceT(["top", "bottom"]),
  insetBlock: t.spaceT("insetBlock"),
  top: t.spaceT("top"),
  insetBlockStart: t.spaceT("insetBlockStart"),
  bottom: t.spaceT("bottom"),
  insetBlockEnd: t.spaceT("insetBlockEnd"),
  left: t.spaceT("left"),
  insetInlineStart: t.logical({
    scale: "space",
    property: { ltr: "left", rtl: "right" }
  }),
  right: t.spaceT("right"),
  insetInlineEnd: t.logical({
    scale: "space",
    property: { ltr: "right", rtl: "left" }
  })
};
Object.assign(position, {
  insetStart: position.insetInlineStart,
  insetEnd: position.insetInlineEnd
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/effect.mjs
var effect = {
  boxShadow: t.shadows("boxShadow"),
  mixBlendMode: true,
  blendMode: t.prop("mixBlendMode"),
  backgroundBlendMode: true,
  bgBlendMode: t.prop("backgroundBlendMode"),
  opacity: true
};
Object.assign(effect, {
  shadow: effect.boxShadow
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/space.mjs
var space = {
  margin: t.spaceT("margin"),
  marginTop: t.spaceT("marginTop"),
  marginBlockStart: t.spaceT("marginBlockStart"),
  marginRight: t.spaceT("marginRight"),
  marginInlineEnd: t.spaceT("marginInlineEnd"),
  marginBottom: t.spaceT("marginBottom"),
  marginBlockEnd: t.spaceT("marginBlockEnd"),
  marginLeft: t.spaceT("marginLeft"),
  marginInlineStart: t.spaceT("marginInlineStart"),
  marginX: t.spaceT(["marginInlineStart", "marginInlineEnd"]),
  marginInline: t.spaceT("marginInline"),
  marginY: t.spaceT(["marginTop", "marginBottom"]),
  marginBlock: t.spaceT("marginBlock"),
  padding: t.space("padding"),
  paddingTop: t.space("paddingTop"),
  paddingBlockStart: t.space("paddingBlockStart"),
  paddingRight: t.space("paddingRight"),
  paddingBottom: t.space("paddingBottom"),
  paddingBlockEnd: t.space("paddingBlockEnd"),
  paddingLeft: t.space("paddingLeft"),
  paddingInlineStart: t.space("paddingInlineStart"),
  paddingInlineEnd: t.space("paddingInlineEnd"),
  paddingX: t.space(["paddingInlineStart", "paddingInlineEnd"]),
  paddingInline: t.space("paddingInline"),
  paddingY: t.space(["paddingTop", "paddingBottom"]),
  paddingBlock: t.space("paddingBlock")
};
Object.assign(space, {
  m: space.margin,
  mt: space.marginTop,
  mr: space.marginRight,
  me: space.marginInlineEnd,
  marginEnd: space.marginInlineEnd,
  mb: space.marginBottom,
  ml: space.marginLeft,
  ms: space.marginInlineStart,
  marginStart: space.marginInlineStart,
  mx: space.marginX,
  my: space.marginY,
  p: space.padding,
  pt: space.paddingTop,
  py: space.paddingY,
  px: space.paddingX,
  pb: space.paddingBottom,
  pl: space.paddingLeft,
  ps: space.paddingInlineStart,
  paddingStart: space.paddingInlineStart,
  pr: space.paddingRight,
  pe: space.paddingInlineEnd,
  paddingEnd: space.paddingInlineEnd
});

// node_modules/@chakra-ui/styled-system/dist/esm/config/scroll.mjs
var scroll = {
  scrollBehavior: true,
  scrollSnapAlign: true,
  scrollSnapStop: true,
  scrollSnapType: true,
  // scroll margin
  scrollMargin: t.spaceT("scrollMargin"),
  scrollMarginTop: t.spaceT("scrollMarginTop"),
  scrollMarginBottom: t.spaceT("scrollMarginBottom"),
  scrollMarginLeft: t.spaceT("scrollMarginLeft"),
  scrollMarginRight: t.spaceT("scrollMarginRight"),
  scrollMarginX: t.spaceT(["scrollMarginLeft", "scrollMarginRight"]),
  scrollMarginY: t.spaceT(["scrollMarginTop", "scrollMarginBottom"]),
  // scroll padding
  scrollPadding: t.spaceT("scrollPadding"),
  scrollPaddingTop: t.spaceT("scrollPaddingTop"),
  scrollPaddingBottom: t.spaceT("scrollPaddingBottom"),
  scrollPaddingLeft: t.spaceT("scrollPaddingLeft"),
  scrollPaddingRight: t.spaceT("scrollPaddingRight"),
  scrollPaddingX: t.spaceT(["scrollPaddingLeft", "scrollPaddingRight"]),
  scrollPaddingY: t.spaceT(["scrollPaddingTop", "scrollPaddingBottom"])
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/typography.mjs
var typography = {
  fontFamily: t.prop("fontFamily", "fonts"),
  fontSize: t.prop("fontSize", "fontSizes", transformFunctions.px),
  fontWeight: t.prop("fontWeight", "fontWeights"),
  lineHeight: t.prop("lineHeight", "lineHeights"),
  letterSpacing: t.prop("letterSpacing", "letterSpacings"),
  textAlign: true,
  fontStyle: true,
  textIndent: true,
  wordBreak: true,
  overflowWrap: true,
  textOverflow: true,
  textTransform: true,
  whiteSpace: true,
  isTruncated: {
    transform(value) {
      if (value === true) {
        return {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        };
      }
    }
  },
  noOfLines: {
    static: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      //@ts-ignore
      WebkitLineClamp: "var(--chakra-line-clamp)"
    },
    property: "--chakra-line-clamp"
  }
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/text-decoration.mjs
var textDecoration = {
  textDecorationColor: t.colors("textDecorationColor"),
  textDecoration: true,
  textDecor: { property: "textDecoration" },
  textDecorationLine: true,
  textDecorationStyle: true,
  textDecorationThickness: true,
  textUnderlineOffset: true,
  textShadow: t.shadows("textShadow")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/transform.mjs
var transform = {
  clipPath: true,
  transform: t.propT("transform", transformFunctions.transform),
  transformOrigin: true,
  translateX: t.spaceT("--chakra-translate-x"),
  translateY: t.spaceT("--chakra-translate-y"),
  skewX: t.degreeT("--chakra-skew-x"),
  skewY: t.degreeT("--chakra-skew-y"),
  scaleX: t.prop("--chakra-scale-x"),
  scaleY: t.prop("--chakra-scale-y"),
  scale: t.prop(["--chakra-scale-x", "--chakra-scale-y"]),
  rotate: t.degreeT("--chakra-rotate")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/list.mjs
var list = {
  listStyleType: true,
  listStylePosition: true,
  listStylePos: t.prop("listStylePosition"),
  listStyleImage: true,
  listStyleImg: t.prop("listStyleImage")
};

// node_modules/@chakra-ui/styled-system/dist/esm/config/transition.mjs
var transition = {
  transition: true,
  transitionDelay: true,
  animation: true,
  willChange: true,
  transitionDuration: t.prop("transitionDuration", "transition.duration"),
  transitionProperty: t.prop("transitionProperty", "transition.property"),
  transitionTimingFunction: t.prop(
    "transitionTimingFunction",
    "transition.easing"
  )
};

// node_modules/@chakra-ui/styled-system/dist/esm/system.mjs
var systemProps = (0, import_lodash.default)(
  {},
  background,
  border,
  color,
  flexbox,
  layout,
  filter2,
  ring,
  interactivity,
  grid,
  others,
  position,
  effect,
  space,
  scroll,
  typography,
  textDecoration,
  transform,
  list,
  transition
);
var layoutSystem = Object.assign({}, space, layout, flexbox, grid, position);
var layoutPropNames = Object.keys(
  layoutSystem
);
var propNames = [...Object.keys(systemProps), ...pseudoPropNames];
var styleProps = { ...systemProps, ...pseudoSelectors };
var isStyleProp = (prop) => prop in styleProps;

// node_modules/@chakra-ui/styled-system/dist/esm/utils/expand-responsive.mjs
var expandResponsive = (styles) => (theme) => {
  if (!theme.__breakpoints)
    return styles;
  const { isResponsive, toArrayValue, media: medias } = theme.__breakpoints;
  const computedStyles = {};
  for (const key in styles) {
    let value = runIfFn(styles[key], theme);
    if (value == null)
      continue;
    value = isObject(value) && isResponsive(value) ? toArrayValue(value) : value;
    if (!Array.isArray(value)) {
      computedStyles[key] = value;
      continue;
    }
    const queries = value.slice(0, medias.length).length;
    for (let index = 0; index < queries; index += 1) {
      const media = medias == null ? void 0 : medias[index];
      if (!media) {
        computedStyles[key] = value[index];
        continue;
      }
      computedStyles[media] = computedStyles[media] || {};
      if (value[index] == null) {
        continue;
      }
      computedStyles[media][key] = value[index];
    }
  }
  return computedStyles;
};

// node_modules/@chakra-ui/styled-system/dist/esm/utils/split-by-comma.mjs
function splitByComma(value) {
  const chunks = [];
  let chunk = "";
  let inParens = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === "(") {
      inParens = true;
      chunk += char;
    } else if (char === ")") {
      inParens = false;
      chunk += char;
    } else if (char === "," && !inParens) {
      chunks.push(chunk);
      chunk = "";
    } else {
      chunk += char;
    }
  }
  chunk = chunk.trim();
  if (chunk) {
    chunks.push(chunk);
  }
  return chunks;
}

// node_modules/@chakra-ui/styled-system/dist/esm/css.mjs
function isCssVar3(value) {
  return /^var\(--.+\)$/.test(value);
}
var isCSSVariableTokenValue = (key, value) => key.startsWith("--") && typeof value === "string" && !isCssVar3(value);
var resolveTokenValue = (theme, value) => {
  if (value == null)
    return value;
  const getVar = (val) => {
    var _a, _b;
    return (_b = (_a = theme.__cssMap) == null ? void 0 : _a[val]) == null ? void 0 : _b.varRef;
  };
  const getValue = (val) => getVar(val) ?? val;
  const [tokenValue, fallbackValue] = splitByComma(value);
  value = getVar(tokenValue) ?? getValue(fallbackValue) ?? getValue(value);
  return value;
};
function getCss(options) {
  const { configs = {}, pseudos = {}, theme } = options;
  const css2 = (stylesOrFn, nested = false) => {
    var _a;
    const _styles = runIfFn(stylesOrFn, theme);
    const styles = expandResponsive(_styles)(theme);
    let computedStyles = {};
    for (let key in styles) {
      const valueOrFn = styles[key];
      let value = runIfFn(valueOrFn, theme);
      if (key in pseudos) {
        key = pseudos[key];
      }
      if (isCSSVariableTokenValue(key, value)) {
        value = resolveTokenValue(theme, value);
      }
      let config = configs[key];
      if (config === true) {
        config = { property: key };
      }
      if (isObject(value)) {
        computedStyles[key] = computedStyles[key] ?? {};
        computedStyles[key] = (0, import_lodash.default)(
          {},
          computedStyles[key],
          css2(value, true)
        );
        continue;
      }
      let rawValue = ((_a = config == null ? void 0 : config.transform) == null ? void 0 : _a.call(config, value, theme, _styles)) ?? value;
      rawValue = (config == null ? void 0 : config.processResult) ? css2(rawValue, true) : rawValue;
      const configProperty = runIfFn(config == null ? void 0 : config.property, theme);
      if (!nested && (config == null ? void 0 : config.static)) {
        const staticStyles = runIfFn(config.static, theme);
        computedStyles = (0, import_lodash.default)({}, computedStyles, staticStyles);
      }
      if (configProperty && Array.isArray(configProperty)) {
        for (const property of configProperty) {
          computedStyles[property] = rawValue;
        }
        continue;
      }
      if (configProperty) {
        if (configProperty === "&" && isObject(rawValue)) {
          computedStyles = (0, import_lodash.default)({}, computedStyles, rawValue);
        } else {
          computedStyles[configProperty] = rawValue;
        }
        continue;
      }
      if (isObject(rawValue)) {
        computedStyles = (0, import_lodash.default)({}, computedStyles, rawValue);
        continue;
      }
      computedStyles[key] = rawValue;
    }
    return computedStyles;
  };
  return css2;
}
var css = (styles) => (theme) => {
  const cssFn = getCss({
    theme,
    pseudos: pseudoSelectors,
    configs: systemProps
  });
  return cssFn(styles);
};

// node_modules/@chakra-ui/styled-system/dist/esm/define-styles.mjs
function defineStyle(styles) {
  return styles;
}
function defineStyleConfig(config) {
  return config;
}
function createMultiStyleConfigHelpers(parts) {
  return {
    definePartsStyle(config) {
      return config;
    },
    defineMultiStyleConfig(config) {
      return { parts, ...config };
    }
  };
}

// node_modules/@chakra-ui/styled-system/dist/esm/get-css-var.mjs
function getCSSVar(theme, scale, value) {
  var _a, _b;
  return ((_b = (_a = theme.__cssMap) == null ? void 0 : _a[`${scale}.${value}`]) == null ? void 0 : _b.varRef) ?? value;
}

// node_modules/@chakra-ui/styled-system/dist/esm/style-config.mjs
function normalize2(value, toArray) {
  if (Array.isArray(value))
    return value;
  if (isObject(value))
    return toArray(value);
  if (value != null)
    return [value];
}
function getNextIndex(values, i) {
  for (let j = i + 1; j < values.length; j++) {
    if (values[j] != null)
      return j;
  }
  return -1;
}
function createResolver(theme) {
  const breakpointUtil = theme.__breakpoints;
  return function resolver(config, prop, value, props) {
    var _a, _b;
    if (!breakpointUtil)
      return;
    const result = {};
    const normalized = normalize2(value, breakpointUtil.toArrayValue);
    if (!normalized)
      return result;
    const len = normalized.length;
    const isSingle = len === 1;
    const isMultipart = !!config.parts;
    for (let i = 0; i < len; i++) {
      const key = breakpointUtil.details[i];
      const nextKey = breakpointUtil.details[getNextIndex(normalized, i)];
      const query = toMediaQueryString(key.minW, nextKey == null ? void 0 : nextKey._minW);
      const styles = runIfFn((_a = config[prop]) == null ? void 0 : _a[normalized[i]], props);
      if (!styles)
        continue;
      if (isMultipart) {
        (_b = config.parts) == null ? void 0 : _b.forEach((part) => {
          (0, import_lodash.default)(result, {
            [part]: isSingle ? styles[part] : { [query]: styles[part] }
          });
        });
        continue;
      }
      if (!isMultipart) {
        if (isSingle)
          (0, import_lodash.default)(result, styles);
        else
          result[query] = styles;
        continue;
      }
      result[query] = styles;
    }
    return result;
  };
}
function resolveStyleConfig(config) {
  return (props) => {
    const { variant, size, theme } = props;
    const recipe = createResolver(theme);
    return (0, import_lodash.default)(
      {},
      runIfFn(config.baseStyle ?? {}, props),
      recipe(config, "sizes", size, props),
      recipe(config, "variants", variant, props)
    );
  };
}

// node_modules/@chakra-ui/styled-system/dist/esm/theming-props.mjs
function omitThemingProps(props) {
  return omit(props, ["styleConfig", "size", "variant", "colorScheme"]);
}

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/calc.mjs
function resolveReference(operand) {
  if (isObject(operand) && operand.reference) {
    return operand.reference;
  }
  return String(operand);
}
var toExpression = (operator, ...operands) => operands.map(resolveReference).join(` ${operator} `).replace(/calc/g, "");
var add = (...operands) => `calc(${toExpression("+", ...operands)})`;
var subtract2 = (...operands) => `calc(${toExpression("-", ...operands)})`;
var multiply = (...operands) => `calc(${toExpression("*", ...operands)})`;
var divide = (...operands) => `calc(${toExpression("/", ...operands)})`;
var negate = (x) => {
  const value = resolveReference(x);
  if (value != null && !Number.isNaN(parseFloat(value))) {
    return String(value).startsWith("-") ? String(value).slice(1) : `-${value}`;
  }
  return multiply(value, -1);
};
var calc = Object.assign(
  (x) => ({
    add: (...operands) => calc(add(x, ...operands)),
    subtract: (...operands) => calc(subtract2(x, ...operands)),
    multiply: (...operands) => calc(multiply(x, ...operands)),
    divide: (...operands) => calc(divide(x, ...operands)),
    negate: () => calc(negate(x)),
    toString: () => x.toString()
  }),
  {
    add,
    subtract: subtract2,
    multiply,
    divide,
    negate
  }
);

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/css-var.mjs
function replaceWhiteSpace(value, replaceValue = "-") {
  return value.replace(/\s+/g, replaceValue);
}
function escape(value) {
  const valueStr = replaceWhiteSpace(value.toString());
  return escapeSymbol(escapeDot(valueStr));
}
function escapeDot(value) {
  if (value.includes("\\."))
    return value;
  const isDecimal2 = !Number.isInteger(parseFloat(value.toString()));
  return isDecimal2 ? value.replace(".", `\\.`) : value;
}
function escapeSymbol(value) {
  return value.replace(/[!-,/:-@[-^`{-~]/g, "\\$&");
}
function addPrefix(value, prefix = "") {
  return [prefix, value].filter(Boolean).join("-");
}
function toVarReference(name, fallback) {
  return `var(${name}${fallback ? `, ${fallback}` : ""})`;
}
function toVarDefinition(value, prefix = "") {
  return escape(`--${addPrefix(value, prefix)}`);
}
function cssVar(name, fallback, cssVarPrefix) {
  const cssVariable = toVarDefinition(name, cssVarPrefix);
  return {
    variable: cssVariable,
    reference: toVarReference(cssVariable, fallback)
  };
}
function defineCssVars(scope, keys2) {
  const vars = {};
  for (const key of keys2) {
    if (Array.isArray(key)) {
      const [name, fallback] = key;
      vars[name] = cssVar(`${scope}-${name}`, fallback);
      continue;
    }
    vars[key] = cssVar(`${scope}-${key}`);
  }
  return vars;
}

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/theme-tokens.mjs
var tokens = [
  "colors",
  "borders",
  "borderWidths",
  "borderStyles",
  "fonts",
  "fontSizes",
  "fontWeights",
  "gradients",
  "letterSpacings",
  "lineHeights",
  "radii",
  "space",
  "shadows",
  "sizes",
  "zIndices",
  "transition",
  "blur",
  "breakpoints"
];
function extractTokens(theme) {
  const _tokens = tokens;
  return pick(theme, _tokens);
}
function extractSemanticTokens(theme) {
  return theme.semanticTokens;
}
function omitVars(rawTheme) {
  const { __cssMap, __cssVars, __breakpoints, ...cleanTheme } = rawTheme;
  return cleanTheme;
}

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/flatten-tokens.mjs
function flattenTokens(theme) {
  const tokens2 = extractTokens(theme);
  const semanticTokens = extractSemanticTokens(theme);
  const isSemanticCondition = (key) => (
    // @ts-ignore
    pseudoPropNames.includes(key) || "default" === key
  );
  const result = {};
  walkObject(tokens2, (value, path) => {
    if (value == null)
      return;
    result[path.join(".")] = { isSemantic: false, value };
  });
  walkObject(
    semanticTokens,
    (value, path) => {
      if (value == null)
        return;
      result[path.join(".")] = { isSemantic: true, value };
    },
    {
      stop: (value) => Object.keys(value).every(isSemanticCondition)
    }
  );
  return result;
}

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/create-theme-vars.mjs
function tokenToCssVar(token, prefix) {
  return cssVar(String(token).replace(/\./g, "-"), void 0, prefix);
}
function createThemeVars(theme) {
  var _a;
  const flatTokens = flattenTokens(theme);
  const cssVarPrefix = (_a = theme.config) == null ? void 0 : _a.cssVarPrefix;
  let cssVars = {};
  const cssMap = {};
  function lookupToken(token, maybeToken) {
    const scale = String(token).split(".")[0];
    const withScale = [scale, maybeToken].join(".");
    const resolvedTokenValue = flatTokens[withScale];
    if (!resolvedTokenValue)
      return maybeToken;
    const { reference } = tokenToCssVar(withScale, cssVarPrefix);
    return reference;
  }
  for (const [token, tokenValue] of Object.entries(flatTokens)) {
    const { isSemantic, value } = tokenValue;
    const { variable, reference } = tokenToCssVar(token, cssVarPrefix);
    if (!isSemantic) {
      if (token.startsWith("space")) {
        const keys2 = token.split(".");
        const [firstKey, ...referenceKeys] = keys2;
        const negativeLookupKey = `${firstKey}.-${referenceKeys.join(".")}`;
        const negativeValue = calc.negate(value);
        const negatedReference = calc.negate(reference);
        cssMap[negativeLookupKey] = {
          value: negativeValue,
          var: variable,
          varRef: negatedReference
        };
      }
      cssVars[variable] = value;
      cssMap[token] = {
        value,
        var: variable,
        varRef: reference
      };
      continue;
    }
    const normalizedValue = isObject(value) ? value : { default: value };
    cssVars = (0, import_lodash.default)(
      cssVars,
      Object.entries(normalizedValue).reduce(
        (acc, [conditionAlias, conditionValue]) => {
          var _a2;
          if (!conditionValue)
            return acc;
          const tokenReference = lookupToken(token, `${conditionValue}`);
          if (conditionAlias === "default") {
            acc[variable] = tokenReference;
            return acc;
          }
          const conditionSelector = ((_a2 = pseudoSelectors) == null ? void 0 : _a2[conditionAlias]) ?? conditionAlias;
          acc[conditionSelector] = { [variable]: tokenReference };
          return acc;
        },
        {}
      )
    );
    cssMap[token] = {
      value: reference,
      var: variable,
      varRef: reference
    };
  }
  return {
    cssVars,
    cssMap
  };
}

// node_modules/@chakra-ui/styled-system/dist/esm/create-theme-vars/to-css-var.mjs
function toCSSVar(rawTheme) {
  const theme = omitVars(rawTheme);
  const {
    /**
     * This is more like a dictionary of tokens users will type `green.500`,
     * and their equivalent css variable.
     */
    cssMap,
    /**
     * The extracted css variables will be stored here, and used in
     * the emotion's <Global/> component to attach variables to `:root`
     */
    cssVars
  } = createThemeVars(theme);
  const defaultCssVars = {
    "--chakra-ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-ring-offset-width": "0px",
    "--chakra-ring-offset-color": "#fff",
    "--chakra-ring-color": "rgba(66, 153, 225, 0.6)",
    "--chakra-ring-offset-shadow": "0 0 #0000",
    "--chakra-ring-shadow": "0 0 #0000",
    "--chakra-space-x-reverse": "0",
    "--chakra-space-y-reverse": "0"
  };
  Object.assign(theme, {
    __cssVars: { ...defaultCssVars, ...cssVars },
    __cssMap: cssMap,
    __breakpoints: analyzeBreakpoints(theme.breakpoints)
  });
  return theme;
}

// node_modules/color2k/dist/index.exports.import.es.mjs
function guard(low, high, value) {
  return Math.min(Math.max(low, value), high);
}
var ColorError = class extends Error {
  constructor(color2) {
    super(`Failed to parse color: "${color2}"`);
  }
};
var ColorError$1 = ColorError;
function parseToRgba(color2) {
  if (typeof color2 !== "string") throw new ColorError$1(color2);
  if (color2.trim().toLowerCase() === "transparent") return [0, 0, 0, 0];
  let normalizedColor = color2.trim();
  normalizedColor = namedColorRegex.test(color2) ? nameToHex(color2) : color2;
  const reducedHexMatch = reducedHexRegex.exec(normalizedColor);
  if (reducedHexMatch) {
    const arr = Array.from(reducedHexMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(r(x, 2), 16)), parseInt(r(arr[3] || "f", 2), 16) / 255];
  }
  const hexMatch = hexRegex.exec(normalizedColor);
  if (hexMatch) {
    const arr = Array.from(hexMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(x, 16)), parseInt(arr[3] || "ff", 16) / 255];
  }
  const rgbaMatch = rgbaRegex.exec(normalizedColor);
  if (rgbaMatch) {
    const arr = Array.from(rgbaMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(x, 10)), parseFloat(arr[3] || "1")];
  }
  const hslaMatch = hslaRegex.exec(normalizedColor);
  if (hslaMatch) {
    const [h, s, l, a] = Array.from(hslaMatch).slice(1).map(parseFloat);
    if (guard(0, 100, s) !== s) throw new ColorError$1(color2);
    if (guard(0, 100, l) !== l) throw new ColorError$1(color2);
    return [...hslToRgb(h, s, l), Number.isNaN(a) ? 1 : a];
  }
  throw new ColorError$1(color2);
}
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i) {
    hash2 = hash2 * 33 ^ str.charCodeAt(--i);
  }
  return (hash2 >>> 0) % 2341;
}
var colorToInt = (x) => parseInt(x.replace(/_/g, ""), 36);
var compressedColorMap = "1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((acc, next) => {
  const key = colorToInt(next.substring(0, 3));
  const hex = colorToInt(next.substring(3)).toString(16);
  let prefix = "";
  for (let i = 0; i < 6 - hex.length; i++) {
    prefix += "0";
  }
  acc[key] = `${prefix}${hex}`;
  return acc;
}, {});
function nameToHex(color2) {
  const normalizedColorName = color2.toLowerCase().trim();
  const result = compressedColorMap[hash(normalizedColorName)];
  if (!result) throw new ColorError$1(color2);
  return `#${result}`;
}
var r = (str, amount) => Array.from(Array(amount)).map(() => str).join("");
var reducedHexRegex = new RegExp(`^#${r("([a-f0-9])", 3)}([a-f0-9])?$`, "i");
var hexRegex = new RegExp(`^#${r("([a-f0-9]{2})", 3)}([a-f0-9]{2})?$`, "i");
var rgbaRegex = new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${r(",\\s*(\\d+)\\s*", 2)}(?:,\\s*([\\d.]+))?\\s*\\)$`, "i");
var hslaRegex = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i;
var namedColorRegex = /^[a-z]+$/i;
var roundColor = (color2) => {
  return Math.round(color2 * 255);
};
var hslToRgb = (hue, saturation, lightness) => {
  let l = lightness / 100;
  if (saturation === 0) {
    return [l, l, l].map(roundColor);
  }
  const huePrime = (hue % 360 + 360) % 360 / 60;
  const chroma = (1 - Math.abs(2 * l - 1)) * (saturation / 100);
  const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
  let red = 0;
  let green = 0;
  let blue = 0;
  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red = chroma;
    blue = secondComponent;
  }
  const lightnessModification = l - chroma / 2;
  const finalRed = red + lightnessModification;
  const finalGreen = green + lightnessModification;
  const finalBlue = blue + lightnessModification;
  return [finalRed, finalGreen, finalBlue].map(roundColor);
};
function parseToHsla(color2) {
  const [red, green, blue, alpha] = parseToRgba(color2).map((value, index) => (
    // 3rd index is alpha channel which is already normalized
    index === 3 ? value : value / 255
  ));
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness, alpha];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue = 60 * (red === max ? (green - blue) / delta + (green < blue ? 6 : 0) : green === max ? (blue - red) / delta + 2 : (red - green) / delta + 4);
  return [hue, saturation, lightness, alpha];
}
function hsla(hue, saturation, lightness, alpha) {
  return `hsla(${(hue % 360).toFixed()}, ${guard(0, 100, saturation * 100).toFixed()}%, ${guard(0, 100, lightness * 100).toFixed()}%, ${parseFloat(guard(0, 1, alpha).toFixed(3))})`;
}
function darken(color2, amount) {
  const [hue, saturation, lightness, alpha] = parseToHsla(color2);
  return hsla(hue, saturation, lightness - amount, alpha);
}
function getLuminance(color2) {
  if (color2 === "transparent") return 0;
  function f(x) {
    const channel = x / 255;
    return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  }
  const [r2, g, b] = parseToRgba(color2);
  return 0.2126 * f(r2) + 0.7152 * f(g) + 0.0722 * f(b);
}
function getContrast(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  return luminance1 > luminance2 ? (luminance1 + 0.05) / (luminance2 + 0.05) : (luminance2 + 0.05) / (luminance1 + 0.05);
}
function rgba(red, green, blue, alpha) {
  return `rgba(${guard(0, 255, red).toFixed()}, ${guard(0, 255, green).toFixed()}, ${guard(0, 255, blue).toFixed()}, ${parseFloat(guard(0, 1, alpha).toFixed(3))})`;
}
function mix(color1, color2, weight) {
  const normalize3 = (n, index) => (
    // 3rd index is alpha channel which is already normalized
    index === 3 ? n : n / 255
  );
  const [r1, g1, b1, a1] = parseToRgba(color1).map(normalize3);
  const [r2, g2, b2, a2] = parseToRgba(color2).map(normalize3);
  const alphaDelta = a2 - a1;
  const normalizedWeight = weight * 2 - 1;
  const combinedWeight = normalizedWeight * alphaDelta === -1 ? normalizedWeight : normalizedWeight + alphaDelta / (1 + normalizedWeight * alphaDelta);
  const weight2 = (combinedWeight + 1) / 2;
  const weight1 = 1 - weight2;
  const r3 = (r1 * weight1 + r2 * weight2) * 255;
  const g = (g1 * weight1 + g2 * weight2) * 255;
  const b = (b1 * weight1 + b2 * weight2) * 255;
  const a = a2 * weight + a1 * (1 - weight);
  return rgba(r3, g, b, a);
}
function lighten(color2, amount) {
  return darken(color2, -amount);
}
function transparentize(color2, amount) {
  const [r2, g, b, a] = parseToRgba(color2);
  return rgba(r2, g, b, a - amount);
}
function toHex(color2) {
  const [r2, g, b, a] = parseToRgba(color2);
  let hex = (x) => {
    const h = guard(0, 255, x).toString(16);
    return h.length === 1 ? `0${h}` : h;
  };
  return `#${hex(r2)}${hex(g)}${hex(b)}${a < 1 ? hex(Math.round(a * 255)) : ""}`;
}

// node_modules/@chakra-ui/theme-tools/dist/esm/color.mjs
var isEmptyObject2 = (obj) => Object.keys(obj).length === 0;
function get3(obj, key, def, p, undef) {
  key = key.split ? key.split(".") : key;
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj;
}
var getColor = (theme, color2, fallback) => {
  const hex = get3(theme, `colors.${color2}`, color2);
  try {
    toHex(hex);
    return hex;
  } catch {
    return fallback ?? "#000000";
  }
};
var getColorVar = (theme, color2, fallback) => {
  return getCSSVar(theme, "colors", color2) ?? fallback;
};
var getBrightness = (color2) => {
  const [r2, g, b] = parseToRgba(color2);
  return (r2 * 299 + g * 587 + b * 114) / 1e3;
};
var tone = (color2) => (theme) => {
  const hex = getColor(theme, color2);
  const brightness = getBrightness(hex);
  const isDark2 = brightness < 128;
  return isDark2 ? "dark" : "light";
};
var isDark = (color2) => (theme) => tone(color2)(theme) === "dark";
var isLight = (color2) => (theme) => tone(color2)(theme) === "light";
var transparentize2 = (color2, opacity) => (theme) => {
  const raw = getColor(theme, color2);
  return transparentize(raw, 1 - opacity);
};
var whiten = (color2, amount) => (theme) => {
  const raw = getColor(theme, color2);
  return toHex(mix(raw, "#fff", amount));
};
var blacken = (color2, amount) => (theme) => {
  const raw = getColor(theme, color2);
  return toHex(mix(raw, "#000", amount / 100));
};
var darken2 = (color2, amount) => (theme) => {
  const raw = getColor(theme, color2);
  return toHex(darken(raw, amount / 100));
};
var lighten2 = (color2, amount) => (theme) => {
  const raw = getColor(theme, color2);
  toHex(lighten(raw, amount / 100));
};
var contrast = (fg, bg) => (theme) => getContrast(getColor(theme, bg), getColor(theme, fg));
var isAccessible = (textColor, bgColor, options) => (theme) => isReadable(getColor(theme, bgColor), getColor(theme, textColor), options);
function isReadable(color1, color2, wcag2 = { level: "AA", size: "small" }) {
  const readabilityLevel = readability(color1, color2);
  switch ((wcag2.level ?? "AA") + (wcag2.size ?? "small")) {
    case "AAsmall":
    case "AAAlarge":
      return readabilityLevel >= 4.5;
    case "AAlarge":
      return readabilityLevel >= 3;
    case "AAAsmall":
      return readabilityLevel >= 7;
    default:
      return false;
  }
}
function readability(color1, color2) {
  return (Math.max(getLuminance(color1), getLuminance(color2)) + 0.05) / (Math.min(getLuminance(color1), getLuminance(color2)) + 0.05);
}
var complementary = (color2) => (theme) => {
  const raw = getColor(theme, color2);
  const hsl = parseToHsla(raw);
  const complementHsl = Object.assign(hsl, [
    (hsl[0] + 180) % 360
  ]);
  return toHex(hsla(...complementHsl));
};
function generateStripe(size = "1rem", color2 = "rgba(255, 255, 255, 0.15)") {
  return {
    backgroundImage: `linear-gradient(
    45deg,
    ${color2} 25%,
    transparent 25%,
    transparent 50%,
    ${color2} 50%,
    ${color2} 75%,
    transparent 75%,
    transparent
  )`,
    backgroundSize: `${size} ${size}`
  };
}
var randomHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padEnd(6, "0")}`;
function randomColor(opts) {
  const fallback = randomHex();
  if (!opts || isEmptyObject2(opts)) {
    return fallback;
  }
  if (opts.string && opts.colors) {
    return randomColorFromList(opts.string, opts.colors);
  }
  if (opts.string && !opts.colors) {
    return randomColorFromString(opts.string);
  }
  if (opts.colors && !opts.string) {
    return randomFromList(opts.colors);
  }
  return fallback;
}
function randomColorFromString(str) {
  let hash2 = 0;
  if (str.length === 0)
    return hash2.toString();
  for (let i = 0; i < str.length; i += 1) {
    hash2 = str.charCodeAt(i) + ((hash2 << 5) - hash2);
    hash2 = hash2 & hash2;
  }
  let color2 = "#";
  for (let j = 0; j < 3; j += 1) {
    const value = hash2 >> j * 8 & 255;
    color2 += `00${value.toString(16)}`.substr(-2);
  }
  return color2;
}
function randomColorFromList(str, list2) {
  let index = 0;
  if (str.length === 0)
    return list2[0];
  for (let i = 0; i < str.length; i += 1) {
    index = str.charCodeAt(i) + ((index << 5) - index);
    index = index & index;
  }
  index = (index % list2.length + list2.length) % list2.length;
  return list2[index];
}
function randomFromList(list2) {
  return list2[Math.floor(Math.random() * list2.length)];
}

// node_modules/@chakra-ui/theme-tools/dist/esm/component.mjs
function mode(light, dark) {
  return (props) => props.colorMode === "dark" ? dark : light;
}
function orient(options) {
  const { orientation, vertical, horizontal } = options;
  if (!orientation)
    return {};
  return orientation === "vertical" ? vertical : horizontal;
}

// node_modules/@chakra-ui/theme-tools/dist/esm/create-breakpoints.mjs
var createBreakpoints = (config) => {
  warn({
    condition: true,
    message: [
      `[chakra-ui]: createBreakpoints(...) will be deprecated pretty soon`,
      `simply pass the breakpoints as an object. Remove the createBreakpoints(..) call`
    ].join("")
  });
  return { base: "0em", ...config };
};

// node_modules/@chakra-ui/theme-tools/dist/esm/css-calc.mjs
function toRef(operand) {
  if (isObject(operand) && operand.reference) {
    return operand.reference;
  }
  return String(operand);
}
var toExpr = (operator, ...operands) => operands.map(toRef).join(` ${operator} `).replace(/calc/g, "");
var add2 = (...operands) => `calc(${toExpr("+", ...operands)})`;
var subtract3 = (...operands) => `calc(${toExpr("-", ...operands)})`;
var multiply2 = (...operands) => `calc(${toExpr("*", ...operands)})`;
var divide2 = (...operands) => `calc(${toExpr("/", ...operands)})`;
var negate2 = (x) => {
  const value = toRef(x);
  if (value != null && !Number.isNaN(parseFloat(value))) {
    return String(value).startsWith("-") ? String(value).slice(1) : `-${value}`;
  }
  return multiply2(value, -1);
};
var calc2 = Object.assign(
  (x) => ({
    add: (...operands) => calc2(add2(x, ...operands)),
    subtract: (...operands) => calc2(subtract3(x, ...operands)),
    multiply: (...operands) => calc2(multiply2(x, ...operands)),
    divide: (...operands) => calc2(divide2(x, ...operands)),
    negate: () => calc2(negate2(x)),
    toString: () => x.toString()
  }),
  {
    add: add2,
    subtract: subtract3,
    multiply: multiply2,
    divide: divide2,
    negate: negate2
  }
);

// node_modules/@chakra-ui/theme-tools/dist/esm/css-var.mjs
function isDecimal(value) {
  return !Number.isInteger(parseFloat(value.toString()));
}
function replaceWhiteSpace2(value, replaceValue = "-") {
  return value.replace(/\s+/g, replaceValue);
}
function escape2(value) {
  const valueStr = replaceWhiteSpace2(value.toString());
  if (valueStr.includes("\\."))
    return value;
  return isDecimal(value) ? valueStr.replace(".", `\\.`) : value;
}
function addPrefix2(value, prefix = "") {
  return [prefix, escape2(value)].filter(Boolean).join("-");
}
function toVarRef(name, fallback) {
  return `var(${escape2(name)}${fallback ? `, ${fallback}` : ""})`;
}
function toVar(value, prefix = "") {
  return `--${addPrefix2(value, prefix)}`;
}
function cssVar2(name, options) {
  const cssVariable = toVar(name, options == null ? void 0 : options.prefix);
  return {
    variable: cssVariable,
    reference: toVarRef(cssVariable, getFallback(options == null ? void 0 : options.fallback))
  };
}
function getFallback(fallback) {
  if (typeof fallback === "string")
    return fallback;
  return fallback == null ? void 0 : fallback.reference;
}

export {
  isBrowser,
  getOwnerWindow,
  getActiveElement,
  isMultiTouchEvent,
  getEventPoint,
  addPointerEvent,
  assignAfter,
  dataAttr,
  ariaAttr,
  isArray,
  isObject,
  callAll,
  callAllHandlers,
  getValidChildren,
  compact,
  createContext,
  cx,
  isFocusable,
  isTabbable,
  getAllFocusable,
  memoizedGet,
  interopDefault,
  lazyDisclosure,
  toPrecision,
  countDecimalPlaces,
  valueToPercent,
  percentToValue,
  roundValueToStep,
  clampValue,
  omit,
  pick,
  breakpoints,
  mapResponsive,
  arrayToObjectNotation,
  runIfFn,
  getScrollParent,
  split,
  splitProps,
  warn,
  import_lodash,
  pseudoSelectors,
  pseudoPropNames,
  tokenToCSSVar,
  background,
  border,
  color,
  flexbox,
  layout,
  filter2 as filter,
  ring,
  interactivity,
  grid,
  others,
  position,
  effect,
  space,
  scroll,
  typography,
  textDecoration,
  transform,
  list,
  transition,
  systemProps,
  layoutPropNames,
  propNames,
  isStyleProp,
  getCss,
  css,
  defineStyle,
  defineStyleConfig,
  createMultiStyleConfigHelpers,
  getCSSVar,
  resolveStyleConfig,
  omitThemingProps,
  calc,
  addPrefix,
  toVarReference,
  toVarDefinition,
  cssVar,
  defineCssVars,
  flattenTokens,
  toCSSVar,
  anatomy,
  accordionAnatomy,
  alertAnatomy,
  avatarAnatomy,
  breadcrumbAnatomy,
  checkboxAnatomy,
  drawerAnatomy,
  editableAnatomy,
  formAnatomy,
  formErrorAnatomy,
  inputAnatomy,
  listAnatomy,
  menuAnatomy,
  modalAnatomy,
  numberInputAnatomy,
  popoverAnatomy,
  progressAnatomy,
  radioAnatomy,
  selectAnatomy,
  sliderAnatomy,
  statAnatomy,
  switchAnatomy,
  tableAnatomy,
  tabsAnatomy,
  tagAnatomy,
  cardAnatomy,
  getColor,
  getColorVar,
  tone,
  isDark,
  isLight,
  transparentize2 as transparentize,
  whiten,
  blacken,
  darken2 as darken,
  lighten2 as lighten,
  contrast,
  isAccessible,
  isReadable,
  readability,
  complementary,
  generateStripe,
  randomColor,
  mode,
  orient,
  createBreakpoints,
  calc2,
  isDecimal,
  addPrefix2,
  toVarRef,
  toVar,
  cssVar2
};
//# sourceMappingURL=chunk-PMGUUL4L.js.map
