import { useState } from 'react';
import { View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import AgendaScreen from './(tabsAdmin)/AgendaScreen';
import ConfigScreen from './(tabsAdmin)/ConfigScreen';
import EquipeScreen from './(tabsAdmin)/EquipeScreen';
import ServicosScreen from './(tabsAdmin)/ServicosScreen';

export default function Admin() {
  const [active, setActive] = useState<'agenda' | 'equipe' | 'servicos' | 'config'>('agenda');

  const renderScreen = () => {
    switch (active) {
      case 'agenda':
        return <AgendaScreen onNew={() => {}} />;
      case 'equipe':
        return <EquipeScreen onNew={() => {}} />;
      case 'servicos':
        return <ServicosScreen onNew={() => {}} />;
      case 'config':
        return <ConfigScreen />;
      default:
        return <AgendaScreen onNew={() => {}} />;
    }
  };

  return (
    <View className="flex-1 bg-bg">
      {renderScreen()}
      <BottomTabs active={active} onChange={setActive} />
    </View>
  );
}