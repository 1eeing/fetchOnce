const fetchOnce = require('../dist/index').default;

describe('fetchOnce', function() {
  const fetchSuccess = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success');
    }, 100);
  });

  const fetchError = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('fail');
    }, 100);
  });

  const fetchRandom = () => new Promise((resolve, reject) => {
    const ran = Math.random() * 10;
    if(ran > 5){
      resolve('success');
    }else{
      reject('fail');
    }
  })

  const fetchSuccessOnce = fetchOnce(fetchSuccess);
  const fetchErrorOnce = fetchOnce(fetchError);
  const fetchRandomOnce = fetchOnce(fetchRandom);

  it('should be fetch once successful', function(done) {
    Promise.all([
      fetchSuccessOnce(),
      fetchSuccessOnce(),
      fetchSuccessOnce(),
    ]).then(() => {
      done()
    }).catch(err => {
      done(err);
    });
  });

  it('should be fetch once fail', function(done) {
    Promise.all([
      fetchErrorOnce(),
      fetchErrorOnce(),
      fetchErrorOnce(),
    ]).then(() => {
      done(new Error('it can not success'));
    }).catch(err => {
      done();
    })
  })

  it('should be fetch once successful', function(done) {
    Promise.all([
      fetchRandomOnce(),
      fetchRandomOnce(),
      fetchRandomOnce(),
      fetchRandomOnce(),
    ]).then(() => {
      done()
    }).catch(err => {
      done(err);
    });
  });
})
