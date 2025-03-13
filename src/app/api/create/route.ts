import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, player_one_username, isPrivate } = await request.json();

  const { data, error } = await supabase.rpc("create_game", {
    game_name_input: name,
    player_one_username_input: player_one_username,
    private_input: isPrivate
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}