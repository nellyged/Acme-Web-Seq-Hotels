const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

const User = conn.define('user', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
  },
});

const Hotel = conn.define('hotel', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
  },
});

const Stay = conn.define('stay', {
  days: {
    type: conn.Sequelize.STRING,
    allowNull: false,
  },
});

Stay.belongsTo(User);
Stay.belongsTo(Hotel);
User.hasMany(Stay);
Hotel.hasMany(Stay);

const userNames = ['moe', 'larry', 'curly'];
const hotelNames = ['sheraton', 'hilton'];
const syncAndSeed = () => {
  //sync the db then seed with data using async await becasue we will do a Promise.all
  return conn.sync({ force: true }).then(async () => {
    //place the returned entry into each place holder for later use
    const [moe, larry, curly] = await Promise.all(
      userNames.map(name => {
        return User.create({ name });
      })
    );

    const [sheraton, hilton] = await Promise.all(
      hotelNames.map(name => {
        return Hotel.create({ name });
      })
    );

    await Promise.all([
      Stay.create({ userId: moe.id, hotelId: sheraton.id, days: 3 }),
      Stay.create({ userId: moe.id, hotelId: hilton.id, days: 5 }),
      Stay.create({ userId: moe.id, hotelId: sheraton.id, days: 4 }),
      Stay.create({ userId: larry.id, hotelId: sheraton.id, days: 19 }),
      Stay.create({ userId: curly.id, hotelId: sheraton.id, days: 4 }),
      Stay.create({ userId: curly.id, hotelId: hilton.id, days: 5 }),
    ]);
  });
};

const getUsersStaysObj = async () => {
  const data = await User.findAll({
    include: [
      {
        model: Stay,
        include: [Hotel],
      },
    ],
  })
    .then(users => {
      const userStayHotel = {};
      users.forEach(user => {
        user.stays.forEach(stay => {
          if (userStayHotel[user.get().name]) {
            userStayHotel[user.get().name].push(
              `${stay.get().hotel.get().name} ( ${stay.get().days} days )`
            );
          } else {
            userStayHotel[user.get().name] = [
              `${stay.get().hotel.get().name} ( ${stay.get().days} days )`,
            ];
          }
        });
      });
      return userStayHotel;
    })
    .catch(e => {
      console.error(e);
    });
  return data;
};

//you wouldnt actually call these methods here in the class
//syncAndSeed();
//give the db time to actually popualte the data so I dont get a deaddlock error
// setTimeout(function() {
//   console.log(getUsersStaysObj());
// }, 3000);

module.exports = {
  syncAndSeed,
  getUsersStaysObj,
};
