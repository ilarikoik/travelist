import { useContext, useEffect, useState } from "react";
import LoadingSkeletonTrip from "./loadingSkeletonTrip";
import { tripsList, trip } from "../interface/triplist";
import { UserContext } from "../utils/userContext";
import { deleteTrip, getTripById } from "../firebase/database/trips";
import { useNavigate } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getWeather from "../api/weather";

interface ListPara {
  handleRef: () => void;
  trips: trip[];
}

export default function TripList({ handleRef, trips }: ListPara) {
  const [weather, setWeather] = useState<any>([]);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const getTripDetails = async (tripId: string) => {
    navigate("/plan", { state: { tripId: tripId } });
  };

  const handleDelete = (tripId: string) => {
    deleteTrip(user.uid, tripId);
    handleRef();
  };

  useEffect(() => {
    const get = async () => {
      if (trips) {
        // Promise.all odottaa että jokasen kyselyn kohdalla saadaan jokin vastaus
        const data = await Promise.all(
          trips.map(async (item) => await getWeather(item.destination))
        );
        setWeather(data);
      }
    };
    get();
  }, [trips]);
  return (
    <>
      {/* {!loading ? (
        <LoadingSkeletonTrip trips={trips} />
      ) : ( */}
      <div className=" w-full h-fit flex flex-col justify-center items-center p-3">
        {trips &&
          trips.map((item, index) => {
            return (
              <div
                key={index}
                className="h-fit w-full max-w-[700px] flex-row justify-center items-center m-5 p-5 rounded-md shadow-lg shadow-grey  "
              >
                <div className=" flex flex-row w-full justify-between ">
                  <div className=" h-fit w-1/3 flex justify-start items-center">
                    <p className="text-accent font-semibold ">
                      {weather[index] && weather[index].current && (
                        <img
                          src={weather[index].current.condition.icon}
                          alt="Weather icon"
                          className="w-10 h-10"
                        />
                      )}
                    </p>
                    <h2 className="text-md font-semibold md:text-xl text-accent">
                      {weather[index] &&
                        weather[index].current &&
                        weather[index].current.temp_c + "°C"}
                    </h2>
                  </div>
                  <DeleteOutlineIcon
                    color="error"
                    className="hover:cursor-pointer"
                    onClick={() => handleDelete(item.tripId)}
                  />
                </div>
                <div
                  className="flex flex-col justify-center items-center hover:cursor-pointer 
                  "
                  onClick={() => getTripDetails(item.tripId)}
                >
                  <h2 className="text-xl font-semibold md:text-3xl text-accent ">
                    {item.destination.toUpperCase()}
                  </h2>
                  <hr className="border-2 border-accent w-4/5" />
                  <div className="text-lg font-semibold md:text-2xl text-accent flex w-full justify-evenly">
                    <h2>{item.year}</h2>
                  </div>
                </div>
                <div className=" flex  justify-end "></div>
              </div>
            );
          })}
      </div>
      {/* )} */}
    </>
  );
}
