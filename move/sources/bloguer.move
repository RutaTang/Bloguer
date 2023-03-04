module bloguer_address::bloguer{

    use std::string::String;
    use std::signer;
    use aptos_std::vector;
    use std::string;
    use aptos_framework::aptos_account::transfer;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::coin;
    #[test_only]
    use aptos_framework::aptos_coin::AptosCoin;


    struct PostStore has key {
        posts: vector<Post>,
    }

    struct Post has store, drop, copy {
        uuid: String,
        title: String,
        description: String,
        content: String,
        publish_date: u64, //timestamp
        update_date: u64, //timestamp
        read_duration: u64, // by minute
        comments: vector<Comment>,
        sponsors: vector<Sponsor>, 
    }

    struct Comment has store, drop, copy {
        uuid: String,
        commentor: address,
        comment_date: u64, //timestamp
        content: String,
    }

    struct Sponsor has store, drop, copy {
        address: address,
        date: u64, //timestamp
        count: u64, 
    }

    fun init_module(account: &signer) {
        // init and move the post store to the account
        let post_store = PostStore {
            posts: vector::empty<Post>(), 
        };
        move_to(account, post_store);
    }

    #[view]
    public fun get_post_by_uuid(module_address: address,uuid: String): Post acquires PostStore {
        //get the post store
        let post_store = borrow_global_mut<PostStore>(module_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.uuid == uuid)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //return the post
        let post = vector::borrow(&post_store.posts, index);
        return *post
    }


    #[view]
    public fun get_posts_length(module_address: address): u64 acquires PostStore {
        //get the post store
        let post_store = borrow_global_mut<PostStore>(module_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        return len
    }

    // Get only uuid, title, description, publish_date, update_date, read_duration of posts
    #[view]
    public fun get_posts_list_by_start_and_end_index(module_address: address, start_index: u64, end_index: u64): vector<Post> acquires PostStore {
        //get the post store
        let post_store = borrow_global_mut<PostStore>(module_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //asserts
        assert!(start_index < end_index, 0);
        assert!(start_index < len, 0);
        assert!(end_index <= len, 0);
        assert!(start_index >= 0, 0);
        assert!(end_index >= 0, 0);
        //return empty vector if posts is empty
        if (len == 0) return vector::empty<Post>();
        // get posts
        let posts = vector::empty<Post>();
        let index = start_index;
        while (index < end_index) {
            let post = vector::borrow(&post_store.posts, index);
            let post = Post {
                uuid: post.uuid,
                title: post.title,
                description: post.description,
                content: string::utf8(b""),
                publish_date: post.publish_date,
                update_date: post.update_date,
                read_duration: post.read_duration,
                comments: vector::empty<Comment>(),
                sponsors: vector::empty<Sponsor>(),
            };
            vector::push_back(&mut posts, post);
            index = index + 1;
        };
        return posts
    }

    public entry fun create_post(account: &signer, uuid: String, title: String, description: String, content: String, publish_date: u64, read_duration: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        let post = Post {
            uuid: uuid,
            title: title,
            description: description,
            content: content,
            publish_date: publish_date,
            update_date: publish_date,
            read_duration: read_duration,
            comments: vector::empty<Comment>(),
            sponsors: vector::empty<Sponsor>(),
        };
        vector::push_back(&mut post_store.posts, post);
    }

    public entry fun delete_post(account: &signer, uuid: String) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.uuid == uuid)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //remove the post
        vector::remove(&mut post_store.posts, index);
    }

    public entry fun update_post(account: &signer, uuid: String, title: String, description: String, content: String, update_date: u64, read_duration: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.uuid == uuid)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //update the post
        let post = vector::borrow_mut(&mut post_store.posts, index);
        post.title = title;
        post.description = description;
        post.content = content;
        post.update_date = update_date;
        post.read_duration = read_duration;
    }

    public entry fun comment_on_a_post(account: &signer, post_uuid: String, comment_uuid: String, content: String, comment_date: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.uuid == post_uuid)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //comment on the post
        let post = vector::borrow_mut(&mut post_store.posts, index);
        let comment = Comment {
            uuid: comment_uuid,
            commentor: signer_address,
            comment_date: comment_date,
            content: content,
        };
        vector::push_back(&mut post.comments, comment);
    }

    public entry fun buy_me_a_coffee(account: &signer, post_uuid: String, sponser_count: u64, sponsor_date: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(@bloguer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.uuid == post_uuid)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //transfer the coin to @bloguer_address
        transfer(account, @bloguer_address, sponser_count); 
        //push to sponsors vec
        let post = vector::borrow_mut(&mut post_store.posts, index);
        let sponsor = Sponsor {
            address: signer_address,
            date: sponsor_date,
            count: sponser_count,
        };
        vector::push_back(&mut post.sponsors, sponsor);
    }


    #[test(admin=@0x123)]
    public fun test_create_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //check if posts length is 1
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 1, 0);
    }

    #[test(admin=@0x123)]
    public fun test_delete_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //check if posts length is 1
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 1, 0);
        //delete the post
        delete_post(&admin, string::utf8(b"1"),);
        //check if posts length is 0
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 0, 0);
    }

    #[test(admin=@0x123)]
    public fun test_update_post(admin: signer) acquires PostStore  {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //update the post
        update_post(&admin, string::utf8(b"1"), string::utf8(b"new title"), string::utf8(b"new description"), string::utf8(b"new content"), 123456789, 10);
        //check if post is updated
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        let post = vector::borrow(&post_store.posts, 0);
        assert!(post.title == string::utf8(b"new title"), 0);
        assert!(post.description == string::utf8(b"new description"), 0);
        assert!(post.content == string::utf8(b"new content"), 0);
    }

    #[test(admin=@0x123)]
    public fun test_comment_on_a_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //comment on the post
        comment_on_a_post(&admin, string::utf8(b"1"), string::utf8(b"1"), string::utf8(b"comment"), 123456789);
        //check if comment is added
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        let post = vector::borrow(&post_store.posts, 0);
        let comment = vector::borrow(&post.comments, 0);
        assert!(comment.content == string::utf8(b"comment"), 0);
    }

    #[test(admin=@0x123)]
    public fun test_get_post_by_uuid(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //get the post
        let post = get_post_by_uuid(signer::address_of(&admin), string::utf8(b"1"));
        //check if post is returned
        assert!(post.title == string::utf8(b"title"), 0);
        assert!(post.description == string::utf8(b"description"), 0);
        assert!(post.content == string::utf8(b"content"), 0);
    }

    #[test(admin=@0x123)]
    public fun test_get_posts_length(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"2"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"3"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"4"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"5"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //get the posts length
        let posts_length = get_posts_length(signer::address_of(&admin));
        //check if posts length is returned
        assert!(posts_length == 5, 0);
    }

    #[test(admin=@0x123)]
    public fun test_get_posts_list_by_start_and_end_index(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"2"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"3"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"4"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        create_post(&admin, string::utf8(b"5"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //from 0 to 2
        let posts_list = get_posts_list_by_start_and_end_index(signer::address_of(&admin), 0, 2);
        assert!(vector::length(&posts_list) == 2, 0);
        //from 4 to 5
        let posts_list = get_posts_list_by_start_and_end_index(signer::address_of(&admin), 4, 5);
        //check if posts list is returned
        assert!(vector::length(&posts_list) == 1, 0);
    }

    #[test(admin=@0x123,module_account=@bloguer_address, core=@0x1)]
    public fun test_buy_me_a_coffee(admin: signer,module_account:signer,core:signer) acquires PostStore  {

        //initialize the coin, core must be @0x1
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(&core);

        // create account and register coin
        account::create_account_for_test(signer::address_of(&admin));
        coin::register<AptosCoin>(&admin);
        account::create_account_for_test(signer::address_of(&module_account));
        coin::register<AptosCoin>(&module_account);

        // mint coin
        coin::deposit(signer::address_of(&admin), coin::mint(100000000, &mint_cap));

        //initialize the module
        init_module(&module_account);
        create_post(&module_account, string::utf8(b"1"), string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        buy_me_a_coffee(&admin, string::utf8(b"1"), 10, 123456789);

        // check if post's sponsors is updated
        let post_store = borrow_global<PostStore>(signer::address_of(&module_account));
        let post = vector::borrow(&post_store.posts, 0);
        assert!(vector::length(&post.sponsors) == 1, 0);

        // check if moduel_account has 10
        assert!(coin::balance<AptosCoin>(signer::address_of(&module_account)) == 10, 0);

        //destroy the coin caps
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
