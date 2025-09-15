"use client";

import { useState, useEffect } from 'react';
import CouncilMemberImage from "@/components/CouncilMemberImage";
import SectionHeader from "../SectionHeader";
import { api } from '@/utils/api';

interface CouncilMember {
  id: string;
  position: string;
  user: {
    id: string;
    name: string | null; 
    imageUrl: string | null;
  };
}

export default function CouncilMembers({ title = "Council members" }: Readonly<{ title?: string }>) {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouncilMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ members: CouncilMember[] }>('/api/v1/council/active-members');
        
        setMembers(response.members || []);
      } catch (error) {
        console.error("Failed to fetch council members:", error);
        setMembers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchCouncilMembers();
  }, []); 

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <SectionHeader text={title} />
        <div className="container mx-auto py-12 text-center">
          <p className="text-gray-600">Loading council members...</p>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <SectionHeader text={title} />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12 px-4 md:px-10 lg:px-16 py-12">
          {members.map((member) => (
            <div key={member.id} className="group cursor-pointer">
              <div className="flex flex-col space-y-6">
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <CouncilMemberImage
                    src={member.user.imageUrl || "/assets/images/small_logo.png"}
                    alt={member.user.name || 'Council Member'}
                    className="w-full h-[300px] lg:h-[405px] object-cover object-center object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#122D1E]/80 via-[#122D1E]/40 to-transparent rounded-b-lg"></div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[#587565] font-poppins text-lg uppercase tracking-wider group-hover:text-primary transition-colors duration-300">
                    {member.user.name}
                  </h3>
                  <p className="text-[#122D1E] font-roboto text-xl group-hover:text-primary/80 transition-colors duration-300">
                    {member.position}
                  </p>
                </div>
                <div className="w-full h-[1px] bg-primary/25 group-hover:bg-primary/50 transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}