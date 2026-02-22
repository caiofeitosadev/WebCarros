import { useEffect, useState } from 'react';
import { Container } from '../../components/container';
import { useNavigate, useParams } from 'react-router';
import { FaWhatsapp } from 'react-icons/fa6';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import type { SingleCarProps } from '../../types/SingleCarProps';
import { Swiper, SwiperSlide } from 'swiper/react';

export function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<SingleCarProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);

  useEffect(() => {
    async function loadCar() {
      if (!id) return;
      const docRef = doc(db, 'cars', id);
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.data()) {
          navigate('/');
        }
        setCar({
          id: snapshot.id,
          uid: snapshot.data()?.uid,
          name: snapshot.data()?.name,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          owner: snapshot.data()?.owner,
          year: snapshot.data()?.year,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          km: snapshot.data()?.km,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
          model: snapshot.data()?.model,
        });
      } catch (err) {
        console.log(err);
      }
    }
    loadCar();
  }, [id, navigate]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                alt={image.name}
                className="w=full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-sm p-5 my-5">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-5">
            <h1 className="font-bold text-3xl text-black">{car.name}</h1>
            <span className="font-bold text-2xl text-black">
              R$ {car.price}
            </span>
          </div>
          <p>{car.model}</p>
          <div className="flex w-full gap-5 my-5">
            <div className="flex flex-col gap-5">
              <div>
                <p>Cidade</p>
                <strong>{car.city}</strong>
              </div>{' '}
              <div>
                <p>Ano</p>
                <strong>{car.year}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p>KM</p>
                <strong>{car.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição</strong>
          <p className="mb-5">{car.description}</p>

          <strong>WhatsApp</strong>
          <p className="mb-5">{car.whatsapp}</p>

          <a
            href={`https://api.whatsapp.com/send?phone=+55${car.whatsapp}&text=Olá, vi esse ${car.name} no site Web Carros e fiquei interessado!`}
            target="_blank"
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 rounded-sm px-2 py-4 text-xl font-medium cursor-pointer hover:bg-green-600 transition-all"
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
}
