
export {
  login,
  forgotPassword,
  verifyOtp, 
  resetPasswordAfterOtp,
  register,
} from "./auth"


export {
  getCompanies,
  // searchCompanies,
  // filterCompaniesByStatus, 
  createCompany,
  updateCompany,
  deleteCompany,
} from "./companies"

export {
  createUser,
} from "./users";

export {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAssignableVehicles
} from "./vehicles";

export {
  fetchEldDevices,
  addEldDevice,
  getEldDeviceById,
  updateEldDevice,
  getUnassignedElds
} from "./eldDevices";

export { createDvir, getDvirs, getUnitDefects, getTrailerDefects, getDvirById, updateDvir } from "./dvir";
