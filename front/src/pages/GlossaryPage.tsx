import React, { useState } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { BookOpen, Search } from "lucide-react";

interface GlossaryTerm {
    id: string;
    term: string;
    category: string;
    definition: string;
}

const glossaryTerms: GlossaryTerm[] = [
    {
        id: "1",
        term: "Hoxxes IV",
        category: "Планеты",
        definition:
            "Основная планета добычи ресурсов Deep Rock Galactic. Характеризуется агрессивной фауной и богатыми месторождениями редких минералов.",
    },
    {
        id: "2",
        term: "Morkite",
        category: "Ресурсы",
        definition:
            "Основной добываемый ресурс. Используется в производстве топлива для космических кораблей.",
    },
    {
        id: "3",
        term: "Glyphid",
        category: "Фауна",
        definition:
            "Доминирующий вид враждебных существ на Hoxxes IV. Обладают развитым социальным интеллектом и агрессивным поведением.",
    },
    {
        id: "4",
        term: "Drop Pod",
        category: "Транспорт",
        definition:
            "Десантный модуль для доставки команд шахтеров на поверхность планеты и эвакуации после завершения миссии.",
    },
    {
        id: "5",
        term: "MOLLY",
        category: "Оборудование",
        definition:
            "Автоматический транспортный дрон (M.U.L.E.) для перевозки добытых ресурсов во время миссий.",
    },
    {
        id: "6",
        term: "Aquarq",
        category: "Ресурсы",
        definition:
            "Редкий кристаллический ресурс. Используется в производстве высокотехнологичного оборудования.",
    },
    {
        id: "7",
        term: "Crystalline Caverns",
        category: "Биомы",
        definition:
            "Биом с высокой концентрацией кристаллических образований. Средний уровень опасности.",
    },
    {
        id: "8",
        term: "Dreadnought",
        category: "Фауна",
        definition:
            "Особо опасный подвид Glyphid. Высокая броня и агрессивность. Требуется опытная команда для нейтрализации.",
    },
    {
        id: "9",
        term: "ScanCom",
        category: "Отделы",
        definition:
            "Отдел сканирования и коммуникации. Занимается разведкой планет и обнаружением ресурсов.",
    },
    {
        id: "10",
        term: "R&D",
        category: "Отделы",
        definition:
            "Отдел исследований и разработки. Создает новое оборудование и технологии для миссий.",
    },
    {
        id: "11",
        term: "Nitra",
        category: "Ресурсы",
        definition:
            "Критически важный ресурс для вызова снабжения во время миссий. Необходим для пополнения боеприпасов и здоровья.",
    },
    {
        id: "12",
        term: "Magma Core",
        category: "Биомы",
        definition:
            "Экстремально опасный биом с высокими температурами и вулканической активностью. Максимальный уровень опасности.",
    },
    {
        id: "13",
        term: "Mission Control",
        category: "Отделы",
        definition:
            "Центр управления миссиями. Координирует все операции на планетах и связь с командами.",
    },
    {
        id: "14",
        term: "Fungus Bogs",
        category: "Биомы",
        definition:
            "Биом с густой грибной растительностью и токсичными спорами. Высокий уровень опасности.",
    },
    {
        id: "15",
        term: "Jadiz",
        category: "Ресурсы",
        definition:
            "Редкий драгоценный минерал зеленого цвета. Используется в производстве продвинутого снаряжения.",
    },
];

export function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTerms = glossaryTerms.filter(
        (term) =>
            term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.definition.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const categories = Array.from(
        new Set(glossaryTerms.map((t) => t.category)),
    );

    return (
        <Layout currentPage="/glossary">
            <div className="max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">Глоссарий терминов</h1>
                    <p className="text-[#8B949E]">
                        Справочник терминов и определений Deep Rock Galactic
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B949E]"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Поиск по терминам..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#161B22] border border-[#30363D] rounded px-10 py-3 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                        <BookOpen className="text-[#FF6B35] mb-2" size={20} />
                        <div className="text-[#C9D1D9] text-2xl font-bold">
                            {glossaryTerms.length}
                        </div>
                        <div className="text-[#8B949E] text-sm">
                            Всего терминов
                        </div>
                    </div>
                    {categories.slice(0, 3).map((category) => (
                        <div
                            key={category}
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg"
                        >
                            <div className="text-[#C9D1D9] text-2xl font-bold">
                                {
                                    glossaryTerms.filter(
                                        (t) => t.category === category,
                                    ).length
                                }
                            </div>
                            <div className="text-[#8B949E] text-sm">
                                {category}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Terms by Category */}
                {categories.map((category) => {
                    const categoryTerms = filteredTerms.filter(
                        (t) => t.category === category,
                    );
                    if (categoryTerms.length === 0) return null;

                    return (
                        <div key={category} className="mb-6">
                            <h2 className="text-[#C9D1D9] mb-3 flex items-center gap-2">
                                <div className="w-1 h-6 bg-[#FF6B35] rounded" />
                                {category}
                            </h2>
                            <div className="space-y-3">
                                {categoryTerms.map((term) => (
                                    <Card key={term.id}>
                                        <CardHeader>
                                            <CardTitle className="text-[#FF6B35]">
                                                {term.term}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-[#C9D1D9]">
                                                {term.definition}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {filteredTerms.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen
                            className="text-[#8B949E] mx-auto mb-4"
                            size={48}
                        />
                        <p className="text-[#8B949E]">Термины не найдены</p>
                        <p className="text-[#8B949E] text-sm mt-2">
                            Попробуйте изменить поисковый запрос
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
