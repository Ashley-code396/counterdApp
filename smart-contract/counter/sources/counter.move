module counter::counter;


public struct Counter has key, store{
    id: UID,
    count: u64
}

public fun create_new_count(ctx: &mut TxContext){

    let counter = Counter{
        id: object::new(ctx),
        count: 0
    };
    transfer::share_object(counter);


}

public fun increment_count(counter: &mut Counter){
    counter.count = counter.count + 1;
    
}


public fun decrement_count(counter: &mut Counter){
   counter.count = counter.count - 1;
    
}


public fun reset_count(counter: &mut Counter){
    counter.count = 0;
    
}