import { FiMapPin, FiTrash2 } from 'react-icons/fi';
import { Container } from '../../components/container';
import { DashboardPanel } from '../../components/panel';
import { useContext, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import type { CarProps } from '../../types/CarProps';
import { AuthContext } from '../../contexts/AuthContext';
import { ref, deleteObject } from 'firebase/storage';

export function Dashboard() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarProps[]>([]);

  useEffect(() => {
    async function loadCars() {
      if (!user?.uid) return;
      const carsRef = collection(db, 'cars');
      const queryRef = query(carsRef, where('uid', '==', user.uid));

      try {
        const response = await getDocs(queryRef);
        const listCars = [] as CarProps[];
        response.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });
        setCars(listCars);
      } catch (err) {
        console.log(err);
      }
    }
    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarProps) {
    const docRef = doc(db, 'cars', car.id);
    try {
      await deleteDoc(docRef);
      car.images.map(async (image) => {
        const imagePath = `images/${image.uid}/${image.name}`;
        const imageRef = ref(storage, imagePath);

        await deleteObject(imageRef);
      });
      setCars(cars.filter((item) => item.id !== car.id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <DashboardPanel />
      <main className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section
            key={car.id}
            className="w-full bg-white rounded-sm relative overflow-hidden"
          >
            <button
              onClick={() => {
                handleDeleteCar(car);
              }}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow cursor-pointer"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full h-70 object-cover"
              src={car.images[0].url}
              alt={car.name}
            />
            <div className="px-5 pb-5 mt-5 grid gap-2">
              <span className="font-bold text-2xl">{car.name}</span>
              <div className="flex flex-col mt-5">
                <strong className="text-black font-medium text-xl">
                  R$ {car.price}
                </strong>
                <span className="text-zinc-700">
                  Ano: {car.year} • {car.km} KM
                </span>
              </div>
              <div className="w-full h-px bg-slate-100 my-2"></div>
              <span className="text-zinc-700 flex items-center gap-2">
                <FiMapPin size={20} color="#3f3f46" />
                {car.city}
              </span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
