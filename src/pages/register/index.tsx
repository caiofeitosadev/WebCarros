import { Link, useNavigate } from 'react-router';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../../services/firebaseConnection';
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const schema = z.object({
  name: z.string().min(5, 'O nome deve ter pelo menos 5 caracteres!'),
  email: z
    .email('Esse campo é obrigatório!')
    .min(1, 'Por favor, insira um e-mail válido!'),

  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres!')
    .nonempty('Esse campo é obrigatório!'),
});
type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, []);

  async function onSubmit(data: FormData) {
    try {
      const username = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      await updateProfile(username.user, {
        displayName: data.name,
      });
      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: username.user.uid,
      });
      console.log('Cadastrado com sucesso!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-5">
        <Link to={'/'} className="mb-5 max-w-sm w-full">
          <img
            src={logoImg}
            className="w-full"
            alt="Logomarca do site Web Cars"
          />
        </Link>
        <form
          className="bg-white max-w-xl w-full rounded-sm px-8 py-4 flex flex-col justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input<FormData>
            type="text"
            name="name"
            placeholder="Digite o seu nome completo"
            error={errors.name?.message}
            register={register}
          />
          <Input<FormData>
            type="email"
            name="email"
            placeholder="Digite o seu nome e-mail"
            error={errors.email?.message}
            register={register}
          />
          <Input<FormData>
            type="password"
            name="password"
            placeholder="Digite a sua senha"
            error={errors.password?.message}
            register={register}
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-5 py-2 rounded-sm cursor-pointer hover:opacity-85"
          >
            Registrar
          </button>
        </form>
        <span>
          Já possui uma conta?{' '}
          <Link
            to={'/login'}
            className="underline hover:text-red-600 transition-all"
          >
            Entre agora
          </Link>
        </span>
      </div>
    </Container>
  );
}
