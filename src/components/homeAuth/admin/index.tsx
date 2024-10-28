'use client'
import React, { useEffect, useState } from 'react';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import scheduleService from '@/services/scheduleService';
import PageSpinner from '@/components/common/pageSpinner';
import { toast } from 'react-toastify';
import userService from '@/services/userService';
import exchangeService from '@/services/exchangeService';
import productService from '@/services/productService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export interface Schedule {
  id: number;
  barberId: number;
  userId: number;
  dateTime: string;
  cutTheHair: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Exchange {
  id: number;
  exchangeDate: string;
  token: string;
  status: number;
  confirmedAt: string;
  userId: number;
  productId: number;
}

const AdminHome = () => {
  const [scheduleData, setScheduleData] = useState<number[]>([]);
  const [topClientsData, setTopClientsData] = useState<{ name: string; count: number }[]>([]);
  const [topProductsData, setTopProductsData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ ,setProductMap] = useState<Map<number, string>>(new Map());

  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const usersResponse = await userService.getListClientUsers();
      const usersMap = new Map<number, User>();

      if (usersResponse.status === 200) {
        usersResponse.data.dados.forEach((user: User) => usersMap.set(user.id, user));
      } else {
        toast.error('Erro ao carregar usuários.');
      }

      const schedulesResponse = await fetchSchedules();
      const agendamentos = schedulesResponse.data.dados;
      processSchedules(agendamentos, usersMap);

      const products = await fetchProducts();
      setProductMap(products);

      const productExchanges = await fetchProductExchanges(products);
      setTopProductsData(productExchanges);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return scheduleService.listSchedules(weekAgo, today, 1);
  };

  const fetchProducts = async () => {
    const response = await productService.getProducts();
    const productMap = new Map<number, string>();
    response.data.dados.forEach((product: { id: number; name: string }) =>
      productMap.set(product.id, product.name)
    );
    return productMap;
  };

  const fetchProductExchanges = async (products: Map<number, string>) => {
    const today = new Date().toISOString().slice(0, 10);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthAgo = oneMonthAgo.toISOString().slice(0, 10);
    const response = await exchangeService.getListExchangeByDate(monthAgo, today);
    const productCounts: { [key: string]: number } = {};

    response.data.dados.forEach((exchange: Exchange) => {
      const productName = products.get(exchange.productId) || 'Produto desconhecido';
      productCounts[productName] = (productCounts[productName] || 0) + 1;
    });

    return Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const processSchedules = (agendamentos: Schedule[], usersMap: Map<number, User>) => {
    const dailyData = Array(6).fill(0);

    agendamentos.forEach((schedule) => {
      const dayIndex = (new Date(schedule.dateTime).getDay() + 6) % 7;
      if (dayIndex < 6) {
        dailyData[dayIndex] += 1;
      }
    });

    const clientCounts: { [key: string]: number } = {};

    agendamentos.forEach((schedule) => {
      const user = usersMap.get(schedule.userId);
      const clientName = user ? `${user.firstName}` : 'Usuário desconhecido';
      clientCounts[clientName] = (clientCounts[clientName] || 0) + 1;
    });

    const sortedClients = Object.entries(clientCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setScheduleData(dailyData);
    setTopClientsData(sortedClients);
  };

  const lineChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Agendamentos por Dia',
        data: scheduleData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: topClientsData.map((client) => client.name),
    datasets: [
      {
        data: topClientsData.map((client) => client.count),
        backgroundColor: ['#3498db', '#1abc9c', '#e74c3c', '#9b59b6', '#f1c40f'],
      },
    ],
  };

  const doughnutChartData = {
    labels: topProductsData.map((product) => product.name),
    datasets: [
      {
        data: topProductsData.map((product) => product.count),
        backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c', '#8e44ad', '#3498db'],
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo, Administrador</h1>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4 text-black">Agendamentos na Última Semana</h2>
            <Line data={lineChartData} />
          </div>

          <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4 text-black">Top 5 Clientes</h2>
            <Pie data={pieChartData} />
          </div>

          <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4 text-black">Produtos Mais Trocados no Último Mês</h2>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
