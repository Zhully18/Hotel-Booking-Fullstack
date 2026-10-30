import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    holidayName: {
      type: String,
      required: [true, "Please add a holiday name"],
    },
    discountPercentage: {
      type: Number,
      required: [true, "Please specify the discount percentage"],
    },
    startDate: {
      type: Date,
      required: [true, "Please specify start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please specify end date"],
    },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;