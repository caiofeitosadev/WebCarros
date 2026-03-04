import { FiTrash, FiUpload } from 'react-icons/fi';
import { Container } from '../../../components/container';
import { DashboardPanel } from '../../../components/panel';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { v4 as uuidV4 } from 'uuid';
import { storage, db } from '../../../services/firebaseConnection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().nonempty('O campo "Nome" é obrigatório'),
  model: z.string().nonempty('O campo "Modelo" é obrigatório'),
  year: z.string().nonempty('O campo "Ano" é obrigatório'),
  km: z.string().nonempty('O campo "KM Rodados" é obrigatório'),
  price: z.string().nonempty('O campo "Preço" é obrigatório'),
  city: z.string().nonempty('O campo "Cidade" é obrigatório'),
  whatsapp: z
    .string()
    .min(1, 'O campo "WhatsApp" é obrigatório')
    .refine((value) => /^(\d{10,12})$/.test(value), {
      message: 'Número de telefone inválido.',
    }),
  description: z.string().nonempty('O campo "Descrição" é obrigatório'),
});
type FormData = z.infer<typeof schema>;

export function NewCar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  interface ImageItemProps {
    file: File;
    name: string;
    previewUrl: string;
  }

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  useEffect(() => {
    return () => {
      carImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [carImages]);

  async function onSubmit(data: FormData) {
    if (carImages.length === 0) {
      toast.error('Envie pelo menos uma imagem desse carro!');
      return;
    }

    try {
      const carListImages = await uploadImages();

      await addDoc(collection(db, 'cars'), {
        name: data.name.toUpperCase(),
        model: data.model,
        whatsapp: data.whatsapp,
        city: data.city,
        year: data.year,
        km: data.km,
        price: data.price,
        description: data.description,
        created: new Date(),
        owner: user?.name,
        uid: user?.uid,
        images: carListImages,
      });

      reset();
      setCarImages([]);
      toast.success('Carro cadastrado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      toast.error(
        'Ocorreu um erro ao cadastrar o seu carro. Por favor, tente novamente!',
      );
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;

    const image = e.target.files[0];

    if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
      toast.error('São permitidas apenas imagens JPEG ou PNG');
      return;
    }

    const imageItem = {
      file: image,
      previewUrl: URL.createObjectURL(image),
      name: image.name,
    };

    setCarImages((images) => [...images, imageItem]);
  }

  async function uploadImages() {
    if (!user?.uid) return [];

    const uploadedImages = [];

    for (const image of carImages) {
      const uidImage = uuidV4();
      const uploadRef = ref(storage, `images/${user.uid}/${uidImage}`);

      const snapshot = await uploadBytes(uploadRef, image.file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      uploadedImages.push({
        uid: user.uid,
        name: uidImage,
        url: downloadUrl,
      });
    }

    return uploadedImages;
  }

  function handleDeletePreview(index: number) {
    setCarImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);

      updated.splice(index, 1);
      return updated;
    });
  }

  return (
    <Container>
      <DashboardPanel />

      <div className="w-full bg-white p-5 rounded-sm flex flex-col sm:flex-row items-center gap-5">
        <button className="relative border w-48 rounded-sm flex items-center justify-center cursor-pointer border-gray-200 h-32 md:48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>
        {carImages.map((item, index) => (
          <div
            key={item.name}
            className="flex h-32 items-center justify-center w-32 relative"
          >
            <button
              className="absolute cursor-pointer"
              onClick={() => handleDeletePreview(index)}
            >
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              src={item.previewUrl}
              alt={item.name}
              className="rounded-sm w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-5 rounded-sm flex flex-col sm:flex-row items-center gap-5 mt-5">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label htmlFor="name">Nome do carro</label>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Onix 1.0"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="model">Modelo do carro</label>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="1.0 Flex Plus Manual"
            />
          </div>
          <div className="flex w-full flex-row items-center gap-5">
            <div className="w-full">
              <label htmlFor="year">Ano</label>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Exemplo: 2025/2026"
              />
            </div>
            <div className="w-full">
              <label htmlFor="km">KM Rodados</label>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="25.000"
              />
            </div>
          </div>
          <div className="flex w-full flex-row items-center gap-5">
            <div className="w-full">
              <label htmlFor="whatsapp">WhatsApp para contato</label>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="84912345678"
              />
            </div>
            <div className="w-full">
              <label htmlFor="city">Cidade</label>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Natal, Parnamirim - RN"
              />
            </div>
          </div>
          <div className="w-full mb-5">
            <label htmlFor="price">Preço</label>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="199.000"
            />
          </div>
          <div className="w-full mb-5">
            <label htmlFor="description">Descrição</label>
            <textarea
              className="border border-gray-200 w-full rounded-sm h-24 p-5 outline-0"
              {...register('description')}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
            />
            {errors.description && (
              <p className=" text-red-500">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-sm bg-red-500 px-5 py-3 text-white w-full cursor-pointer hover:opacity-90"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
}
