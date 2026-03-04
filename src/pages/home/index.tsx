import { useEffect, useState } from 'react';
import { Container } from '../../components/container';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router';
import type { CarProps } from '../../types/CarProps';

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    async function loadCars() {
      const carsRef = collection(db, 'cars');
      const queryRef = query(carsRef, orderBy('created', 'asc'));

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
  }, []);

  async function loadPrevCars() {
    const carsRef = collection(db, 'cars');
    const queryRef = query(carsRef, orderBy('created', 'asc'));

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

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCar() {
    if (input === '') {
      loadPrevCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, 'cars'),
      where('name', '>=', input.toUpperCase()),
      where('name', '<=', input.toUpperCase() + '\uf8ff'),
    );
    const querySnapshot = await getDocs(q);

    const listCars = [] as CarProps[];

    querySnapshot.forEach((doc) => {
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
  }

  return (
    <Container>
      <section className="bg-white p-5 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-5">
        <input
          type="text"
          placeholder="Digite o que procura"
          className="w-full border border-gray-200 rounded-sm py-2 px-5 outline-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-red-500 py-2 px-5 rounded-sm text-white cursor-pointer"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>
      <h1 className="font-bold text-center mt-10 mb-10 text-4xl text-gray-900">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-sm overflow-hidden">
              <div
                className="w-full h-72 rounded-sm bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? 'none' : 'block',
                }}
              ></div>
              <img
                className="w-full mb-2 max-h-72 hover:scale-105 transition-all object-cover"
                src={car.images[0].url}
                alt={car.name}
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? 'block' : 'none',
                }}
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
                <div className="w-full h-px bg-slate-100"></div>
                <span className="text-zinc-700 flex items-center gap-2">
                  <FiMapPin size={20} color="#3f3f46" />
                  {car.city}
                </span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
