import { Types } from "mongoose";
import type { ObjectId } from "mongoose";
import { isUserInArray, type IsUserInArrayInput } from "@/lib/utils/userUtils";

// Define test case types following the test-guide pattern
type UserArrayTestCase = IsUserInArrayInput & {
  expected: boolean;
  description: string;
};

describe("userUtils", () => {
  describe("isUserInArray", () => {
    // Create some test ObjectIds
    const objectId1 = new Types.ObjectId("507f1f77bcf86cd799439011");
    const objectId2 = new Types.ObjectId("507f1f77bcf86cd799439012");
    const objectId3 = new Types.ObjectId("507f1f77bcf86cd799439013");

    const testCases: UserArrayTestCase[] = [
      // Valid cases with string IDs
      {
        array: ["123", "456", "789"],
        userId: "456",
        expected: true,
        description: "finds string userId in array of strings",
      },
      {
        array: ["123", "456", "789"],
        userId: "999",
        expected: false,
        description: "returns false when string userId not in array",
      },

      // Valid cases with ObjectIds
      {
        array: [
          objectId1.toString(),
          objectId2.toString(),
          objectId3.toString(),
        ],
        userId: objectId2.toString(),
        expected: true,
        description:
          "finds ObjectId in array when searching with its string representation",
      },
      {
        array: [
          objectId1.toString(),
          objectId2.toString(),
          objectId3.toString(),
        ],
        userId: "507f1f77bcf86cd799439014",
        expected: false,
        description: "returns false when ObjectId string not in array",
      },

      // Mixed array cases
      {
        array: [objectId1.toString(), "456", objectId3.toString()],
        userId: "456",
        expected: true,
        description:
          "finds string userId in mixed array of ObjectIds and strings",
      },
      {
        array: [objectId1.toString(), "456", objectId3.toString()],
        userId: objectId1.toString(),
        expected: true,
        description: "finds ObjectId in mixed array when searching with string",
      },

      // Edge cases
      {
        array: [],
        userId: "123",
        expected: false,
        description: "returns false for empty array",
      },
      {
        array: ["123", "456"],
        userId: null,
        expected: false,
        description: "returns false for null userId",
      },
      {
        array: ["123", "456"],
        userId: undefined,
        expected: false,
        description: "returns false for undefined userId",
      },
      {
        array: ["", "456"],
        userId: "",
        expected: false,
        description: "returns false for empty string userId",
      },
    ];

    test.each(testCases)("$description", ({ array, userId, expected }) => {
      expect(isUserInArray({ array, userId })).toBe(expected);
    });

    // Additional test for array validation
    it("should handle invalid array input", () => {
      // @ts-expect-error Testing invalid input
      expect(isUserInArray({ array: null, userId: "123" })).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isUserInArray({ array: undefined, userId: "123" })).toBe(false);
    });
  });
});
