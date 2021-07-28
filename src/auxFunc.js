const getArrays = (input) => {

    const ret = []
    for (const [key, value] of Object.entries(input)) {
        if (value)
            ret.push(key)
    }
    return ret
}

const getEntryDate = (input) => {
    const dateInput = new Date(input)
    let date = new Date()
    if (dateInput > date)
        date = dateInput
    else
        date = null
    return date
}

const getPriceRange = (input) => {
    const ret = []
    if (input[0])
        ret.push((Number)(input[0]))

    else ret.push(0)

    if (input[1])
        ret.push((Number)(input[1]))

    else ret.push(Infinity)

    return ret
}

const getArea = (input) => {
    const area = input?.trim().split(',')
    if (area.length > 1)
        return [area[0].trim(), area[1].trim()]
    return area
}

const getFilters = (filters) => {
    const { areaSearch, assetTypes, numOfRooms, PriceRange, advancedSearchOptions } = JSON.parse(filters)

    const area = getArea(areaSearch)
    const types = getArrays(assetTypes)
    const checkBoxes = getArrays(advancedSearchOptions.checkBoxes)
    const entryDate = getEntryDate(advancedSearchOptions.entryDate)
    const price = getPriceRange(PriceRange)

    const ret = {}

    if (checkBoxes.length > 0)
        ret["propertyInfo.properties"] = { $in: checkBoxes }
    if (advancedSearchOptions.floors[0] > -2 || advancedSearchOptions.floors[1] < 13)
        ret["address.floorNum"] = { $gte: advancedSearchOptions.floors["0"], $lte: (Number)(advancedSearchOptions.floors["1"]) }
    if (numOfRooms[0] > 0 || numOfRooms[1] > 0)
        ret["propertyInfo.numOfRooms"] = { $gte: numOfRooms[0], $lt: (numOfRooms[1] === 0 ? Infinity : numOfRooms[1] + 1) }
    if (types.length > 0)
        ret["address.propertyType"] = { $in: types }
    if (area.length > 0 && area[0] !== '')
        ret["address.city"] = area.length === 1 ? area[0] : area[1]
    if (area.length > 1)
        ret["address.street"] = area[0]
    if (advancedSearchOptions.size[0] > -1 || advancedSearchOptions.size[1] > -1)
        ret["payments.actualSize"] = { $gte: advancedSearchOptions.size[0], $lt: (advancedSearchOptions.size[1] == -1 ? Infinity : advancedSearchOptions.size[1]) }
    if (advancedSearchOptions.freeText !== "")
        ret["propertyInfo.freeText"] = { $regex: new RegExp(advancedSearchOptions.freeText, "g") }
    if (price[0] > 0 || price[1] < Infinity)
        ret["payments.price"] = { $gte: price[0], $lt: price[1] }
    if (entryDate)
        ret["payments.entryDate"] = { $gte: entryDate }

    return ret

}

module.exports = {
    getFilters
}



