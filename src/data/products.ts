import redvelvet from "@/assets/cookie-redvelvet.jpg";
import duoblack from "@/assets/cookie-duoblack.jpg";
import nutella from "@/assets/cookie-nutella.jpg";
import meioamargo from "@/assets/cookie-meioamargo.jpg";
import churros from "@/assets/cookie-churros.jpg";
import ninho from "@/assets/cookie-ninho.jpg";
import kitkat from "@/assets/cookie-kitkat.jpg";
import chocolate from "@/assets/cookie-chocolate.jpg";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  soldOut?: boolean;
};

export const products: Product[] = [
  { id: "red-velvet", name: "Red Velvet", price: 12.5, image: redvelvet,
    description: "Massa de baunilha, cacau e chocolate branco, recheado com ganache de cream cheese e geleia de morango." },
  { id: "duo-black", name: "Duo Black", price: 12.5, image: duoblack,
    description: "Massa de cacau, pedaços de chocolate branco e ao leite, recheado com chocolate branco e chocolate meio amargo." },
  { id: "nutella", name: "Nutella", price: 12.5, image: nutella,
    description: "Massa clássica de baunilha com chocolate ao leite e recheio de Nutella." },
  { id: "meio-amargo", name: "Chocolate Meio Amargo", price: 12.5, image: meioamargo,
    description: "Massa de cacau com pedaços de chocolate meio amargo." },
  { id: "churros", name: "Churros", price: 13.5, image: churros,
    description: "Massa amanteigada com chocolate branco e canela, com recheio cremoso de doce de leite." },
  { id: "ninho-blueberry", name: "Ninho e Blueberry", price: 13.5, image: ninho,
    description: "Massa tradicional com chocolate branco, recheado com ganache de ninho e geleia artesanal de blueberry." },
  { id: "kit-kat", name: "Kit Kat", price: 14.5, image: kitkat,
    description: "Massa de baunilha com pedaços de KitKat e chocolate ao leite, recheado com creme de KitKat." },
];

export const heroChocolate = chocolate;