interface Opt {
  type: 'session' | 'local' | 'memory'
  key?: string
}

interface PrmiseQueue {
  resolve: any
  reject: any
}

const validKey = (opt: Opt) => {
  if (['session', 'local'].includes(opt.type) && !opt.key) {
    return false;
  }
  return true;
}

const getLocalStorage = (key: string) => {
  return window.localStorage.getItem(key);
}

const getSessionStorage = (key: string) => {
  return window.sessionStorage.getItem(key);
}

const saveLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, value);
}

const saveSessionStorage = (key: string, value: any) => {
  window.sessionStorage.setItem(key, value);
}

const getFuncMap = {
  local: getLocalStorage,
  session: getSessionStorage,
  memory: () => void 0,
}

const saveFuncMap = {
  local: saveLocalStorage,
  session: saveSessionStorage,
  memory: () => {}
}

const fetchOnce = (fn: (...args: any) => Promise<any>, opt: Opt = { type: 'memory' }) => {
  if (!validKey(opt)) {
    throw Error('存储到storage中需要在opt中传入key');
  }

  const dispatch = (isSuccess: boolean, value: any) => {
    while (promiseQueue.length) {
      const p = promiseQueue.shift();
      p[isSuccess ? 'resolve' : 'reject'](value);
    }
  }

  const fnQueue: any = [];
  const promiseQueue: PrmiseQueue[] = [];
  const errors: any[] = [];
  const { type, key } = opt;
  const saveRes = saveFuncMap[type];
  const getRes = getFuncMap[type];

  let result = getRes(key);
  let lock = false;

  return function (...args: any) {
    return new Promise((resolve, reject) => {
      if (result) {
        return resolve(result);
      }
      fnQueue.push(fn);
      promiseQueue.push({ resolve, reject });
      while (fnQueue.length && !lock) {
        lock = true;
        const _fn = fnQueue.shift();

        // 当一个请求成功，全部都成功
        // 当全部请求失败，才算失败
        _fn.apply(this, args)
          .then((res: any) => {
            fnQueue.length = 0;
            errors.length = 0;
            dispatch(true, res);
            result = res;
            saveRes(key, res);
          })
          .catch((error: any) => {
            errors.push(error);
          })
          .finally(() => {
            lock = false;
          });
      }
      if (errors.length) {
        dispatch(false, errors);
        errors.length = 0;
      }
    })
  }
}

export default fetchOnce;
