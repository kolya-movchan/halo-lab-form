import { fetchGet } from "./api";

import { City } from "types/City";
import { Doctor } from "types/Doctor";
import { Speciality } from "types/Speciality";
import { toast } from "react-toastify";

function showError(data: string) {
  return toast.error(`Failed to load ${data}`)
}

export const getCities = (dispatch: React.Dispatch<React.SetStateAction<City[]>>) => {
  fetchGet<City[]>('9fcb58ca-d3dd-424b-873b-dd3c76f000f4')
    .then((cities) => dispatch(cities))
    .catch(() => showError('cities'));
};

export const getSpecialities = (
  dispatch: React.Dispatch<React.SetStateAction<Speciality[]>>,
  dispatchVisible: React.Dispatch<React.SetStateAction<Speciality[]>>
) => {
  fetchGet<Speciality[]>('e8897b19-46a0-4124-8454-0938225ee9ca')
    .then((speciality) => {
      dispatch(speciality);
      dispatchVisible(speciality);
    })
    .catch(() => showError('specialities'));
};

export const getDoctors = (
  dispatch: React.Dispatch<React.SetStateAction<Doctor[]>>
) : Doctor[] | void => {
  fetchGet<Doctor[]>('3d1c993c-cd8e-44c3-b1cb-585222859c21')
    .then((doctors) => {
      dispatch(doctors);
    })
    .catch(() => showError('doctors'));
};
