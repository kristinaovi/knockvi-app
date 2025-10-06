import { Widgets2ChartData, Widgets2ChartData2, Widgets2ChartData2Widgets, Widgets2ChartDataWidgets } from './Chart';
import { Package, Factory, Truck } from "lucide-react";

export const WidgetsData = {
  title: 'Total Order',
  gros: 50,
  total: 10_000,
  color: 'secondary',
  icon: 'cart',
};
export const WidgetsData2 = {
  title: 'Total Production',
  gros: 70,
  total: 4_200,
  color: 'primary',
  icon: 'tag',
};
export const WidgetsData3 = {
  title: 'Total Inventory',
  gros: 70,
  total: 4_200,
  color: 'primary',
  icon: 'tag',
};
export const WidgetsData4 = {
  title: 'Total Shipping',
  gros: 70,
  total: 4_200,
  color: 'primary',
  icon: 'tag',
};
export const WidgetsData1WidgetsPage = [
  {
    title: 'Purchase',
    gros: 50,
    total: 10_000,
    color: 'secondary',
    icon: 'cart',
  },
  {
    title: 'Sales return',
    gros: 20,
    total: 7000,
    color: 'warning',
    icon: 'return-box',
  },
  {
    title: 'Sales',
    gros: 70,
    total: 4_200,
    color: 'primary',
    icon: 'tag',
  },
  {
    title: 'Purchase rate',
    gros: 70,
    total: 5700,
    color: 'success',
    icon: 'rate',
  },
];

export const Widgets2Data = {
  title: 'Orders',
  total: '1,80k',
  chart: Widgets2ChartData,
};
export const Widgets2Data2 = {
  title: 'Profit',
  total: '6,90k',
  chart: Widgets2ChartData2,
};
export const Widgets2DataWidgets = {
  title: 'Orders',
  total: '1,80k',
  chart: Widgets2ChartDataWidgets,
};
export const Widgets2Data2Widgets = {
  title: 'Profit',
  total: '6,90k',
  chart: Widgets2ChartData2Widgets,
};

export const LightCardData = [
  {
    title: 'Income',
    icon: 'income',
    price: '$22,678',
    gros: '+$456',
    color: 'success',
  },
  {
    title: 'Expense',
    icon: 'expense',
    price: '$12,057',
    gros: '+$256',
    color: 'danger',
  },
  {
    title: 'Cashback',
    icon: 'doller-return',
    price: '$8,475',
  },
];


export const LightCardData2 = [
  {
    title: "Order",
    icon: <Package size={24} color="#FF0000" />, // hijau
    price: "1500 pcs",
    color: "success",
  },
  {
    title: "Production",
    icon: <Factory size={24} color="#007BFF" />, // merah
    price: "1000 pcs",
    color: "danger",
  },
  {
    title: "Shipping",
    icon: <Truck size={24} color="#28A745" />, // biru
    price: "500 pcs",
  },
];

export const ActivityData = [
  {
    title: 'Updated Product',
    subTitle: '8th March, 2022',
    time: '1 day ago',
    dis: 'Quisque a consequat ante sit amet magna...',
    color: 'primary',
  },
  {
    title: 'Tello just like your product',
    subTitle: '15th Oct, 2022 ',
    time: 'Today',
    dis: 'Quisque a consequat ante sit amet magna...',
    color: 'warning',
  },
  {
    title: 'Tello just like your product',
    subTitle: '20th Sep, 2022',
    time: '12:00 PM',
    dis: 'Quisque a consequat ante sit amet magna...',
    color: 'secondary',
  },
];

export const RecentSalesData = [
  {
    image: '1.jpg',
    title: 'Jane Cooper',
    subTitle: '10 minutes ago',
    badge: '$200.00',
  },
  {
    image: '2.jpg',
    title: 'Brooklyn Simmons',
    subTitle: '19 minutes ago',
    badge: '$970.00',
  },
  {
    image: '3.jpg',
    title: 'Leslie Alexander',
    subTitle: '2 hours ago',
    badge: '$300.00',
  },
  {
    image: '4.jpg',
    title: 'Travis Wright',
    subTitle: '8 hours ago',
    badge: '$450.00',
  },
  {
    image: '5.jpg',
    title: ' Mark Green',
    subTitle: '1 day ago',
    badge: '$768.00',
  },
];

export const NoteLabels = [
  {
    title: 'SAAS',
    color: 'primary',
  },
  {
    title: 'E-Commerce',
    color: 'success',
  },
  {
    title: 'Crypto',
    color: 'warning',
  },
  {
    title: 'Project',
    color: 'info',
  },
  {
    title: 'NFT',
    color: 'secondary',
  },
  {
    title: '+9',
    color: 'light',
  },
];
