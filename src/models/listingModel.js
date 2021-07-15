const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    address: {
        propertyType: {
            type: String
        },
        city: {
            type: String
        },
        street: {
            type: String
        },
        number: {
            type: String
        },
        floorNum: {
            type: String
        },
        floorsInBuilding: {
            type: String
        },
    },
    propertyInfo: {
        numOfRooms: {
            type: Number
        },
        parking: {
            type: Number
        },
        porch: {
            type: Number
        },
        properties: {
            type: Object
        },
        freeText: {
            type: String
        },
    },
    payments: {
        numOfPayments: {
            type: String
        },
        buildingFee: {
            type: Number
        },
        arnona: {
            type: Number
        },
        size: {
            type: Number
        },
        actualSize: {
            type: Number
        },
        price: {
            type: Number
        },
        entryDate: {
            type: Date
        }
    },
    mediaUrls: {
        video: {
            type: String
        },
        mainImg: {
            type: String
        },
        images: [{
            type: String
        }]
    },
    contact: {
        main: {
            name: {
                type: String
            },
            number: {
                type: String
            }
        },
        second: {
            name: {
                type: String
            },
            number: {
                type: String
            }
        },
        email: {
            type: String
        }
    }
}, {
    timestamps: true
})

const Listing = mongoose.model('Listings', listingSchema)

module.exports = Listing
