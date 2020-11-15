// in controllers/stuff.js

const Thing = require("../models/thing");
const fs = require("fs");
var sanitize = require('mongo-sanitize');
const thing = require("../models/thing");

exports.createThing = (req, res, next) => {
 const thingObject = sanitize (JSON.parse(req.body.sauce ));
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
   
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Thing.updateOne(
    { _id: req.params.id },
    { ...thingObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.addLikes = (req, res, next) => {

  Thing.findOne({
    _id: req.params.id
  })
    .then((thing) => {
      if (req.body.like==1) {
        Thing.updateOne(
          { _id: req.params.id },
          { $set : { usersLiked : req.body.userId },
            $inc: {likes: 1}
          }
          //{ $push : { likes : thing.usersLiked.length }}
          //compte = thing.usersLiked.length
           
          ).then(() => res.status(200).json({ message: "Sauce Liker avec succes!" }))
          .catch((error) => res.status(400).json({ error }));
          console.log(thing.usersLiked.length)
      }
      if (req.body.like==-1) {
        Thing.updateOne(
          { _id: req.params.id },
          { $set : { usersDisliked : req.body.userId },
            $inc: {dislikes: 1}
          }
          //compte = req.params.usersLiked.length
          ).then(() => res.status(200).json({ message: "Sauce Deliker avec succes!" }))
          .catch((error) => res.status(400).json({ error }));  
      }
      
      
      
      res.status(200).json("like mise à jour avec succes");
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
    if (req.body.like==0) {
      Thing.findOne({
        _id: req.params.id
      })
        .then((thing) => {
          
          const check = thing.usersLiked.includes(req.body.userId);
          if (check) 
            {
              Thing.updateOne(
                { _id: req.params.id },
                { $pull : { usersLiked : req.body.userId },
                 // $push: {likes: thing.usersLiked.length}
                
                 // $remove : {likes: -1}
                 $inc: {likes: -1}
                }
                ).then(() => res.status(200).json({ message: "liker enlevé avec succes!" }))
                .catch((error) => res.status(400).json({ error }));
            }
            else
            {
         
               Thing.updateOne(
                 { _id: req.params.id },
                 { $pull : { usersDisliked : req.body.userId },
                   //$push: {dislikes: thing.Disliked.length}
                  // $pop : {dislikes: -1}
                   $inc: {dislikes: -1}
                 }
                 ).then(() => res.status(200).json({ message: "Deliker enlevé avec succes!" }))
                 .catch((error) => res.status(400).json({ error }));  
            }
         
          
          
          res.status(200).json("like mise à jour avec succes");
        })
        .catch((error) => {
          res.status(404).json({
            error: error,
          });
        });
    }

}



  
/*






if (req.body.like==0){
  const check = sauce.usersLiked.includes(req.body.userId);
  if (check) 
    {
         Thing.updateOne(
      { _id: req.params.id },
      { $pull : { usersLiked : req.body.userId },
       // $push: {likes: thing.usersLiked.length}
      
       // $remove : {likes: -1}
       $inc: {likes: -1}
      }
      ).then(() => res.status(200).json({ message: "liker enlevé avec succes!" }))
      .catch((error) => res.status(400).json({ error }));
   }
   else
   {

      Thing.updateOne(
        { _id: req.params.id },
        { $pull : { usersDisliked : req.body.userId },
          //$push: {dislikes: thing.Disliked.length}
         // $pop : {dislikes: -1}
          $inc: {dislikes: -1}
        }
        ).then(() => res.status(200).json({ message: "Deliker enlevé avec succes!" }))
        .catch((error) => res.status(400).json({ error }));  
   }
}








*/



















































/*

if (req.body.like==0){
 Thing.findOne({
  _id: req.params.id
})
  .then((thing) => {
   // on vérifie le like de l'utilisateur
   const check = sauce.usersLiked.includes(req.body.userId);
    if (check) {
     Thing.updateOne(
       { _id: req.params.id },
       { $pull : { usersLiked : req.body.userId },
        // $push: {likes: thing.usersLiked.length}
       
        // $remove : {likes: -1}
        $inc: {likes: -1}
       }
       ).then(() => res.status(200).json({ message: "liker enlevé avec succes!" }))
       .catch((error) => res.status(400).json({ error }));
    }
    else
    {

       Thing.updateOne(
         { _id: req.params.id },
         { $pull : { usersDisliked : req.body.userId },
           //$push: {dislikes: thing.Disliked.length}
          // $pop : {dislikes: -1}
           $inc: {dislikes: -1}
         }
         ).then(() => res.status(200).json({ message: "Deliker enlevé avec succes!" }))
         .catch((error) => res.status(400).json({ error }));  
    }
    res.status(200).json("like mise à jour avec succes");
  })
  .catch((error) => {
    res.status(404).json({
      error: error,
    });
  });

  }




*/



























/*
if (req.body.like==1) {
    Thing.updateOne(
      { _id: req.params.id },
      { $set : { usersLiked : req.body.userId },
        $inc: {likes: 1}
      }
      //{ $push : { likes : thing.usersLiked.length }}
      //compte = thing.usersLiked.length
       
      ).then(() => res.status(200).json({ message: "Sauce Liker avec succes!" }))
      .catch((error) => res.status(400).json({ error }));
      console.log(thing.usersLiked.length)
  }
  if (req.body.like==-1) {
    Thing.updateOne(
      { _id: req.params.id },
      { $set : { usersDisliked : req.body.userId },
        $inc: {dislikes: 1}
      }
      //compte = req.params.usersLiked.length
      ).then(() => res.status(200).json({ message: "Sauce Deliker avec succes!" }))
      .catch((error) => res.status(400).json({ error }));  
  }

*/













/**
 *
 * @param req { Object }
 * @param res { Object }
 * @param msg { String } Message d'erreur
 * @param like { String } Like | Dislike | removeLike | removeDislike
 */


/*
const liking = (req, res, msg, like) => {
  let liked;
  switch (like) {
      case 'like':
          liked = {
              $push: {userslike : req.body.userId},
              $inc: {likes: 1}
          }
          break;
      case 'dislike':
          liked = {
              $push: {usersDlike : req.body.userId},
              $inc: {dislikes: 1}
          }
          break;
      case 'removeLike':
          liked = {
              $pull: {usersLiked: req.body.userId},
              $inc: {likes: -1}
          }
          break;
      case 'removeDislike':
          liked = {
              $pull: {usersDisliked: req.body.userId},
              $inc: {dislikes: -1}
          }
          break;
      default:
          res.status(500).json({message: 'Une erreur inconnue est survenue'});
          break;
  }
  Thing.updateOne({ _id: req.params.id }, liked)
      .then(() => res.status(200).json({message: msg}))
      .catch(error => res.status(400).json({error}));
}

exports.like = (req, res) => {
  switch (req.body.like) {
      // Like d'une sauce
      case 1:
          liking(req, res, "Like de la sauce", 'like');
          break;
      // dislike d'une sauce
      case -1:
          liking(req, res, "Dislike de la sauce", 'dislike');
          break;
      // Annulation d'un like - dislike
      case 0:
        Thing.findOne({_id: req.params.id})
              .then(Thing => {
                  // on vérifie le like de l'utilisateur
                  const check = Thing.usersLiked.includes(req.body.userId);
                  if (check) {
                      liking(req, res, 'Suppression du like', 'removeLike');
                  } else {
                      liking(req, res, 'Suppression du dislike', 'removeDislike');
                  }
              })
              .catch(error => res.status(500).json({error}));
          break;
      default:
          res.status(500).json({message: 'Une erreur inconnue est survenue !'});
  }
};
*/













































/*
exports.addLikes = (req, res, next) => {
   let compte =19
  console.log(req.body.like)
  console.log(compte)
  //var compte =0;
  Thing.findOne({
    _id: req.params.id
  })
    .then((thing) => {
     
      if (thing.usersLiked.indexOf(req.body.userId )==0||thing.usersDisliked.indexOf(req.body.userId )==0) {
        if (req.body.like==0) {
          Thing.updateOne(
            { _id: req.params.id },
            { $pull : { usersLiked : req.body.userId },
              $inc: {likes: -1}
            }
            ).then(() => res.status(200).json({ message: "liker enlevé avec succes!" }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (req.body.like==0) {
          Thing.updateOne(
            { _id: req.params.id },
            { $pull : { usersDisliked : req.body.userId },
              $inc: {dislikes: -1}
            }
            ).then(() => res.status(200).json({ message: "Deliker enlevé avec succes!" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
      else
      {
        if (req.body.like==1) {
          Thing.updateOne(
            { _id: req.params.id },
            { $set : { usersLiked : req.body.userId },
              $inc: {likes: 1}
            }
            //{ $push : { likes : thing.usersLiked.length }}
            //compte = thing.usersLiked.length
             
            ).then(() => res.status(200).json({ message: "Sauce Liker avec succes!" }))
            .catch((error) => res.status(400).json({ error }));
            console.log(thing.usersLiked.length)
        }
        if (req.body.like==-1) {
          Thing.updateOne(
            { _id: req.params.id },
            { $set : { usersDisliked : req.body.userId },
              $inc: {dislikes: -1}
            }
            //compte = req.params.usersLiked.length
            ).then(() => res.status(200).json({ message: "Sauce Deliker avec succes!" }))
            .catch((error) => res.status(400).json({ error }));
            
        }
      }
      res.status(200).json("like mise à jour avec succes");
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
    }
*/




















































    
    /*if (req.body.like=-1) {
      Thing.updateOne(
        { _id: req.params.id },
        { $push : { usersDisliked : req.params.id }, _id: req.params.id}
        )
       
        .then(() => res.status(200).json({ message: "Sauce Liker avec succes!" }))
        .catch((error) => res.status(400).json({ error }));
      
    }
};*/
/*

exports.addLikes = (req, res, next) => {





  Thing.find({ _id: req.params.usersLiked })
  .then((thing) => {
    if (!thing) 
    things
      .compare(req.params.id,req.params.usersLiked)
      .then((valid) => {
        if (!valid) {
          return res.status(402).json({ error: "Vous avez deja liker !" });
        }
        Thing.updateOne(
          { _id: req.params.id },
          { $push : { usersLiked : req.params.id }, _id: req.params.id}
          
        )
          .then(() => res.status(200).json({ message: "Sauce Liker avec succes !" }))
          .catch((error) => res.status(400).json({ error }));
      
      })
      .catch((error) => res.status(500).json({ error }));
  })
  
  .catch((error) => res.status(500).json({ error }));




  
};
*/



/*

Thing.updateOne(
    { _id: req.params.id },
    { $push : { usersLiked : req.params.id }, _id: req.params.id}
    
  )
    .then(() => res.status(200).json({ message: "Sauce Liker !" }))
    .catch((error) => res.status(400).json({ error }));


//{
  //  return res.status(401).json({ error: "Utilisateur non trouvé !" });
  //}


 exports.addLikes = (req, res, next) => {
  Thing.findOne({
    _id: req.params.usersLiked,
  })
    .then((thing) => {
      res.status(200).json({ message: "Sauce deja Liker !" });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
    res.status(200).json({ message: "Message de test Pour le bouton LIKES !" })
console.log("Ceci est un test")
req.params.usersLiked.push({ _id: req.params.id })
};
exports.adddisLikes = (req, res, next) => {
  
  Thing.findOne({
    _id: req.params.usersLiked,
  })
    .then((thing) => {
      res.status(200).json({ message: "Sauce deja Liker !" });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
    
  };*/
