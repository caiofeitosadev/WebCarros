import { Link, useNavigate } from 'react-router';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { useEffect } from 'react';

const schema = z.object({
  email: z
    .email('Por favor, insira um e-mail válido!')
    .min(1, 'Esse campo é obrigatório!'),

  password: z.string().min(1, 'A senha é obrigatória!'),
});
type FormData = z.infer<typeof schema>;

export function Login() {
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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/dashboard', { replace: true });
      console.log('Login com sucesso');
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
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
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
            Acessar
          </button>
        </form>
        <span>
          Ainda não possui uma conta?{' '}
          <Link
            to={'/register'}
            className="underline hover:text-red-600 transition-all "
          >
            Cadastre-se!
          </Link>
        </span>
      </div>
    </Container>
  );
}
