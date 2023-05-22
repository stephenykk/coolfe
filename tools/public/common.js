const $ = (s) => document.querySelector(s);

function output(data, selector = ".output") {
  $(selector).textContent = data;
}

function outputChunk(str, selector = '.output') {
  const container = $(selector)
  const div = document.createElement('div')
  div.textContent = str
  container.appendChild(div)
  return container
}

const query = {
  stringify(params) {
    return Object.keys(params)
      .reduce(
        (qstr, key) => qstr + `&${key}=${encodeURIComponent(params[key])}`,
        ""
      )
      .replace(/^&/, "");
  },
  parse(qstr) {
    return qstr.split("&").reduce((params, part) => {
      const [key, val] = part.split("=");
      const value = decodeURIComponent(val);
      params[key] = value;
      return params;
    }, {});
  },
};

function isEmpty(val) {
  if (typeof val === "string") {
    return val === "";
  } else if (Array.isArray(val)) {
    return val.length === 0;
  } else if (Object.prototype.toString.call(val).slice(8, -1) === "Object") {
    return Object.keys(val).length === 0;
  }
  return false;
}

const request = (function () {
  const get = (url, params = {}) => {
    const uri = isEmpty(params)
      ? url
      : url + (url.includes("?") ? "&" : "?") + query.stringify(params);

    return new Promise((resolve) => {
      const dataPromise = fetch(uri, { method: "GET" })
        .then((res) => res.text())
        .then((data) => data);
      resolve(dataPromise);
    });
  };

  const post = (url, data = {}) => {
    return new Promise((resolve) => {
      const dataPromise = fetch(url, {
        body: query.stringify(data),
        method: "POST",
      })
        .then((res) => res.text())
        .then((data) => data);

      resolve(dataPromise);
    });
  };

  return { get, post };
})();

const SRequest = (function () {
  const get = async (url, params = {}, dataCb = console.log) => {
    const uri = isEmpty(params)
      ? url
      : url + (url.includes("?") ? "&" : "?") + query.stringify(params);

      const response = await fetch(uri, { method: "GET" })
      const reader = response.body.getReader()
      while(true) {
        const { done, value} = await reader.read()

        const decoder = new TextDecoder()
        if (done) {
          break;
        }
        dataCb(decoder.decode(value))
      }

      return response
  };

  const post = async (url, data = {}, dataCb = console.log) => {
      const response = await fetch(url, {
        body: query.stringify(data),
        method: "POST",
      })
      const reader = response.body.getReader()

      while(true) {
        const { done, value } = await reader.read()
        if (done) {
          break;
        }

        const decoder = new TextDecoder()
        dataCb(decoder.decode(value))
      }

      return response
  };

  return { get, post };
})();

function hide(selector) {
  $(selector).style.visibility = 'hidden'
}
function show(selector) {
  $(selector).style.visibility = 'visible'
}

function sleep(second = 1) {
  return new Promise(resolve => setTimeout(resolve, second * 1000))
}


