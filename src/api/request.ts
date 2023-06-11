import { City } from "types/City";
import { Doctor } from "types/Doctor";
import { Speciality } from "types/Speciality";
import { fetchGet } from "./api";

export const getCities = (dispatch: React.Dispatch<React.SetStateAction<City[]>>) => {
  fetchGet<City[]>('9fcb58ca-d3dd-424b-873b-dd3c76f000f4')
    .then((cities) => dispatch(cities))
    .catch(error => {
      //error logic
    })
};

export const getSpeciality = (
  dispatch: React.Dispatch<React.SetStateAction<Speciality[]>>,
  dispatchVisible: React.Dispatch<React.SetStateAction<Speciality[]>>
) => {
  fetchGet<Speciality[]>('e8897b19-46a0-4124-8454-0938225ee9ca')
    .then((speciality) => {
      dispatch(speciality);
      dispatchVisible(speciality);
    })
    .catch(error => {
      //error logic
    })
};

export const getDoctors = (dispatch: React.Dispatch<React.SetStateAction<Doctor[]>>) => {
  fetchGet<Doctor[]>('3d1c993c-cd8e-44c3-b1cb-585222859c21')
    .then((doctors) => dispatch(doctors))
    .catch(error => {
      //error logic
    })
};