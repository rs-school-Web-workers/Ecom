import DanilaImage from '../../assets/imgs/AboutUsPhoto/Danila.jpg';
import KirillImage from '../../assets/imgs/AboutUsPhoto/Kirill.jpg';
import TatianaImage from '../../assets/imgs/AboutUsPhoto/Tatiana.jpg';
import { DataAboutUs } from '../Page/AboutUsPage/types';

export const data: DataAboutUs[] = [
  {
    img: DanilaImage,
    name: 'Danila',
    role: 'Front-end developer',
    shortBio:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore iusto assumenda ratione natus nihil numquam repellat? Explicabo, quos? Corrupti modi deleniti nihil natus tenetur dolores accusantium fuga iusto debitis ipsam?',
    ghLink: '',
  },
  { img: KirillImage, name: 'Kirill', role: 'Front-end developer', shortBio: '', ghLink: '' },
  { img: TatianaImage, name: 'Tatiana', role: 'Front-end developer', shortBio: '', ghLink: '' },
];
