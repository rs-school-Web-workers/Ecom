import DanilaImage from '../../assets/imgs/AboutUsPhoto/Danila.jpg';
import KirillImage from '../../assets/imgs/AboutUsPhoto/Kirill.jpg';
import TatianaImage from '../../assets/imgs/AboutUsPhoto/Tatiana.jpg';
import { DataAboutUs } from '../Page/AboutUsPage/types';

export const data: DataAboutUs[] = [
  {
    img: DanilaImage,
    name: 'Danila',
    role: 'Front-end developer',
    shortBio: `Hello, my name is Danila! 🌟 I graduated "MITSO" with a degree in marketing economics. I live in Minsk, I love sports, learning new things, reading books, and never standing still. My journey into front-end development started two years ago when I decided to switch career paths. I took paid courses from scratch, tried to find a job, but felt a lack of confidence in my knowledge and practical skills. Thanks to my friends' advice, I knew about RSSchool. That's how I ended up here and got what I was missing and even more! Thanks for this challenging year. 🚀✨`,
    ghLink: 'https://github.com/FroZe36',
  },
  {
    img: KirillImage,
    name: 'Kirill',
    role: 'Front-end developer',
    shortBio: '',
    ghLink: 'https://github.com/Salt-Upon-Wounds',
  },
  {
    img: TatianaImage,
    name: 'Tatiana',
    role: 'Front-end developer',
    shortBio: '',
    ghLink: 'https://github.com/khvorosttt',
  },
];
