const db = require('../../db/index.js');

//GET /reviews
const getReviews = (req, res) => {

   const product_id= req.query.product_id || 12345;
   const page = req.query.page || 1;
   const count = req.query.count || 5;
   const sort = req.query.sort ? `ORDER BY ${req.query.sort}DESC` : `ORDER BY date DESC`;
   const startIndex = (page - 1) * count;
   const endIndex = page * count;

  const getData = async () => {
    const result = db.query(
      `SELECT reviews.id AS review_id,rating,summary,recommend,response,body,to_char(to_timestamp(date/1000),'MM/DD/YYYY HH24:MI:SS') AS date,reviewer_name,helpfulness,reported,COUNT(url),json_build_object('url', array_agg(url)) AS photos
      FROM reviews
        LEFT JOIN reviews_photos ON reviews.id=reviews_photos.review_id
      WHERE product_id=${product_id} AND reported=false
      GROUP BY 1
      ${sort}`
   )
   const reviews = await Promise.all([result]);
   return reviews;

  }

  getData()
  .then(result => {

    result[0].rows.forEach(eachReview => {
      const urls = eachReview.photos.url;
      eachReview.photos = [];
     urls.forEach((eachPhoto,index) => {
       if(eachPhoto) {
         eachReview.photos.push({id: index, url: eachPhoto})
       }
    })
    })

    const sendBack = { product: product_id, page: page, count:count, result: result[0].rows.slice(startIndex, endIndex)}
    res.status(200);
    res.send(sendBack);
  })
  .catch(err => console.log(err))
};

//GET /reviews/meta
const getMeta = (req, res) => {
  const product_id= req.query.product_id || 12345;

 const getMetaData = async () => {
   const ratings = db.query(
    `SELECT json_build_object(recommend, COALESCE(sum(CASE WHEN recommend THEN 1 ELSE 0 END),0)) AS recommend,json_build_object(not recommend,COALESCE(sum(CASE WHEN recommend THEN 0 ELSE 1 END),0))AS notRecommend,json_build_object(rating, count(rating)) AS ratings
    FROM reviews
    WHERE product_id=${product_id} AND reported=false
    GROUP BY rating, recommend`)

    const characteristics = db.query(
      `SELECT AVG(value)::numeric(10,4)AS value,name,characteristics.id FROM characteristics Full JOIN characteristic_reviews
          ON characteristic_reviews.characteristic_id=characteristics.id
          WHERE product_id=${product_id}
          GROUP BY name,characteristics.id`
    )
  const reviews = await Promise.all([ratings,characteristics]);
  return reviews;

 }

 getMetaData()
 .then(result => {
   let ratings = {};
   let recommended = { 0: 0, 1: 0};
   let sendBack = {product_id: product_id.toString(), ratings: {}, recommended: recommended}
     result[0].rows.forEach(eachRating => {
     ratings = {...ratings,...eachRating.ratings};
     if (eachRating.recommend.true) {
       sendBack.recommended[1]++;
     }
     if (eachRating.notrecommend.false) {
      sendBack.recommended[0]++;
    }
   });
   sendBack.ratings = ratings;

   let characteristics = {};
   result[1].rows.forEach((eachCharacteristic) => {
      let char = {
        [eachCharacteristic.name]: {
          id: eachCharacteristic.id,
          value: eachCharacteristic.value
        }
      }
      characteristics = {...characteristics, ...char}
   })

   sendBack.characteristics = characteristics;
   res.status(200);
   res.send(sendBack);
 })
 .catch(err => console.log(err))

};

// POST /reviews
  const addReview = (req, res) => {
    const date = new Date().getTime().toString();
    const product_id= req.body.product_id || 1;
    const rating = req.body.rating;
    const summary = req.body.summary;
    const body = req.body.body;
    const recommend = req.body.recommend;
    const name = req.body.name;
    const email = req.body.email;
    const photos = req.body.photos || [];
    const characteristics = req.body.characteristics || {};
    const response = null;
    if(req.body.response) {
      const response = req.body.response;
    }

    const toReviews = db.query(
      `INSERT INTO reviews (product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) VALUES(${product_id},${rating},${date},'${summary}','${body}',${recommend},false,'${name}','${email}',${response},0) RETURNING id;`
    )
    .then(async (result) => {
      try {

        const review_id = result.rows[0].id;
          if(photos.length !== 0){
            for (const url of photos) {
              await db.query(
               `INSERT INTO reviews_photos (review_id,url) VALUES(${review_id},'${url}')`
              )
            }

          }

          if(characteristics !== {}){
            for (const keys in characteristics) {
               await db.query(
                 `INSERT INTO characteristic_reviews (characteristic_id,review_id,value) VALUES(${keys},${review_id},${characteristics[keys]})`
               )
            }
          }
          return 'CREATED!';
      }

        catch(err){ console.log(err) }
    })
    .then(response => {
      res.status(200);
      res.send(response);
    })
    .catch(err => console.log(err));
}

//PUT /reviews/:review_id/helpful
const markReviewHelpful = (req, res) => {
  db.query(
    `UPDATE reviews
     SET helpfulness = helpfulness + 1
     WHERE id=${req.params.review_id};
    `
  ).then(result => {
    res.status(200);
    res.send('CREATED');
  })
}

//PUT /reviews/:review_id/report
const reportReview = (req, res) => {
  db.query(
    `UPDATE reviews
     SET reported = true
     WHERE id=${req.params.review_id};
    `
  ).then(result => {

    res.sendStatus(201);
  })
}

module.exports = {
  getReviews,
  getMeta,
  addReview,
  markReviewHelpful,
  reportReview
}