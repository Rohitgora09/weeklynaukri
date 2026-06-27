import './src/lib/load-env.js';
import { supabase } from './src/lib/supabase.js';

async function testQuery() {
  console.log("Querying 'study_materials' table...");
  const { data, error } = await supabase
    .from('study_materials')
    .select('*');
  
  if (error) {
    console.error("Error querying table:", error.message);
  } else {
    console.log(`Success! Found ${data.length} records:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

testQuery();
