"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const Banner_model_1 = require("./Banner.model");
const createBanner = (service) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Banner_model_1.Banner.create(service);
});
const findBannerById = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Banner_model_1.Banner.findById(serviceId);
});
const getAllBanners = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Banner_model_1.Banner.find();
    return result;
    // const serviceQuery = new QueryBuilder(Service.find(), query)
    //   .search(serviceSearchableFields)
    //   .filter()
    //   .sort()
    //   .paginate()
    //   .fields();
    // const result = await serviceQuery.modelQuery;
    // const metaData = await serviceQuery.countTotal();
    // return {
    //   meta: metaData,
    //   data: result,
    // };
});
const updateBannerById = (serviceId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Banner_model_1.Banner.findByIdAndUpdate(serviceId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteBannerById = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Banner_model_1.Banner.findByIdAndDelete(serviceId);
    return result;
});
exports.BannerService = {
    createBanner,
    getAllBanners,
    findBannerById,
    updateBannerById,
    deleteBannerById,
};
