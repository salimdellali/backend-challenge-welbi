import {
  explodeStringOnCommas,
  countSimilarValues,
  getUpToFirst3ProgramNames,
  setOrIncrementMapValueByKey,
  extractDateStringFromISODateTimeUTC,
  countDaysBetweenISODateTimesUTC,
  buildSuccessResultDTO,
  buildErrorResultDTO,
} from "./utils"

describe("utils.ts unit tests", () => {
  describe("explodeStringOnCommas", () => {
    it("should return empty array when string is null", () => {
      expect(explodeStringOnCommas(null)).toEqual([])
    })

    it("should return empty array when string is empty", () => {
      expect(explodeStringOnCommas("")).toEqual([])
    })

    it("should return array of 1 string", () => {
      expect(explodeStringOnCommas("Reading")).toEqual(["Reading"])
    })

    it("should return array of strings split by commas", () => {
      expect(explodeStringOnCommas("Reading,Socializing")).toEqual([
        "Reading",
        "Socializing",
      ])
    })
  })

  describe("countSimilarValues", () => {
    it("should return 0 when both arrays are empty", () => {
      expect(countSimilarValues([], [])).toEqual(0)
    })

    it("should return 0 when first array is empty", () => {
      expect(countSimilarValues([], ["Reading", "Socializing"])).toEqual(0)
    })

    it("should return 0 when second array is empty", () => {
      expect(countSimilarValues(["Reading", "Socializing"], [])).toEqual(0)
    })

    it("should return 0 when no similar values", () => {
      expect(
        countSimilarValues(["Reading", "Socializing"], ["Family"])
      ).toEqual(0)
    })

    it("should return number of similar values case 1", () => {
      expect(
        countSimilarValues(["Reading", "Socializing"], ["Reading", "Family"])
      ).toEqual(1)
    })

    it("should return number of similar values case 2", () => {
      expect(
        countSimilarValues(
          ["Reading", "Socializing", "Family"],
          ["Reading", "Family"]
        )
      ).toEqual(2)
    })

    it("should return number of similar values case 3", () => {
      expect(
        countSimilarValues(
          ["Reading", "Socializing", "Family"],
          ["Reading", "Singing", "Family", "Socializing"]
        )
      ).toEqual(3)
    })
  })

  describe("getUpToFirst3ProgramNames", () => {
    it("should return empty array when input array is empty", () => {
      expect(getUpToFirst3ProgramNames([])).toEqual([])
    })

    it("should return array with 1 program name when input array has 1 program name", () => {
      expect(getUpToFirst3ProgramNames(["Reading"])).toEqual(["Reading"])
    })

    it("should return array with 2 program names when input array has more than 2 program names", () => {
      expect(getUpToFirst3ProgramNames(["Reading", "Socializing"])).toEqual([
        "Reading",
        "Socializing",
      ])
    })

    it("should return array with 3 program names when input array has 3 program names", () => {
      expect(
        getUpToFirst3ProgramNames(["Reading", "Socializing", "Family"])
      ).toEqual(["Reading", "Socializing", "Family"])
    })

    it("should return array with only 3 program names when input array has more than 3 program names", () => {
      expect(
        getUpToFirst3ProgramNames([
          "Reading",
          "Socializing",
          "Family",
          "Singing",
        ])
      ).toEqual(["Reading", "Socializing", "Family"])
    })
  })

  describe("setOrIncrementMapValueByKey", () => {
    it("should set value when key does not exist", () => {
      const map = new Map()
      setOrIncrementMapValueByKey(map, "Reading")
      expect(map.get("Reading")).toEqual(1)
    })

    it("should set then increment value when same key exists", () => {
      const map = new Map()
      setOrIncrementMapValueByKey(map, "Reading")
      setOrIncrementMapValueByKey(map, "Reading")
      expect(map.get("Reading")).toEqual(2)
    })

    it("should set 2 different values when different key exists", () => {
      const map = new Map()
      setOrIncrementMapValueByKey(map, "Reading")
      setOrIncrementMapValueByKey(map, "Socializing")
      expect(map.get("Reading")).toEqual(1)
      expect(map.get("Socializing")).toEqual(1)
    })

    it("should set and increment 2 different values when 2 different key exists", () => {
      const map = new Map()
      setOrIncrementMapValueByKey(map, "Reading")
      setOrIncrementMapValueByKey(map, "Socializing")
      setOrIncrementMapValueByKey(map, "Socializing")
      setOrIncrementMapValueByKey(map, "Reading")
      expect(map.get("Reading")).toEqual(2)
      expect(map.get("Socializing")).toEqual(2)
    })
  })

  describe("extractDateStringFromISODateTimeUTC", () => {
    it("should return valid date string case 1", () => {
      expect(
        extractDateStringFromISODateTimeUTC("2012-05-13T09:22:01.941Z")
      ).toEqual("2012-05-13")
    })

    it("should return valid date string case 2", () => {
      expect(
        extractDateStringFromISODateTimeUTC("1953-12-26T02:18:23.423Z")
      ).toEqual("1953-12-26")
    })
  })

  describe("countDaysBetweenISODateTimesUTC", () => {
    it("should return 0 when same date time", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2012-05-13T09:22:01.941Z",
          "2012-05-13T09:22:01.941Z"
        )
      ).toEqual(0)
    })

    it("should return 0 when the difference is less that 24h by 1ms", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2012-05-13T00:00:00.000Z",
          "2012-05-13T23:59:59.999Z"
        )
      ).toEqual(0)
    })

    it("should return 1 when the difference is more that 24h by 1ms", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2012-05-13T00:00:00.000Z",
          "2012-05-14T00:00:00.001Z"
        )
      ).toEqual(1)
    })

    it("should return 1 when comparing a datetime with exact tomorrow's datetime", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2022-04-29T00:00:00.000Z",
          "2022-04-30T00:00:00.000Z"
        )
      ).toEqual(1)
    })

    it("should return 1 when comparing a datetime with exact tomorrow's datetime inverted", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2022-04-30T00:00:00.000Z",
          "2022-04-29T00:00:00.000Z"
        )
      ).toEqual(1)
    })

    it("should return 30 when comparing a datetime in April vs same exact datetime in May", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2022-04-16T00:00:00.000Z",
          "2022-05-16T00:00:00.000Z"
        )
      ).toEqual(30)
    })

    it("should return 31 when comparing a datetime in May vs same exact datetime in June", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2022-05-16T00:00:00.000Z",
          "2022-06-16T00:00:00.000Z"
        )
      ).toEqual(31)
    })

    it("should return 28 when comparing a datetime in February vs same exact datetime in March", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2022-02-16T00:00:00.000Z",
          "2022-03-16T00:00:00.000Z"
        )
      ).toEqual(28)
    })

    it("should return 29 when comparing a datetime in February vs same exact datetime in March on (2024 is bissextile year)", () => {
      expect(
        countDaysBetweenISODateTimesUTC(
          "2024-02-16T00:00:00.000Z",
          "2024-03-16T00:00:00.000Z"
        )
      ).toEqual(29)
    })
  })

  describe("buildSuccessResultDTO", () => {
    it("should correctly return success result dto", () => {
      expect(buildSuccessResultDTO("some success data")).toEqual({
        data: "some success data",
        error: null,
      })
    })
  })

  describe("buildErrorResultDTO", () => {
    it("should correctly return error result dto", () => {
      expect(buildErrorResultDTO("some error message", 400)).toEqual({
        data: null,
        error: {
          message: "some error message",
          httpStatusCode: 400,
        },
      })
    })
  })
})
